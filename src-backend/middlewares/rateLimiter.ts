import { IRequest } from 'itty-router';
import { RateLimitConfig, RateLimitResult } from '../durable-objects/rateLimiter';
import { NextFunction } from '../middlewareComposer';

/**
 * Check if request is internal (should bypass rate limiting)
 */
function isInternalRequest(request: Request): boolean {
	// Check for explicit internal request header
	if (request.headers.get('X-Internal-Request') === 'true') {
		return true;
	}

	// Check for Cloudflare internal request indicator
	const cf = (request as any).cf;
	if (cf?.internal === true) {
		return true;
	}

	// Check for Cloudflare Ray ID (internal requests may not have this, but this is a weak check)
	// Better to rely on explicit headers or cf.internal

	return false;
}

/**
 * Resolve identifier for rate limiting
 * Returns scoped identifier like: "api:user:123" or "auth:ip:1.2.3.4"
 */
function resolveIdentifier(request: IRequest, scope: string): string {
	if (request.user?.user_id) {
		return `${scope}:user:${request.user.user_id}`;
	}

	// Fallback to IP
	const ip =
		(request as any).cf?.ip ||
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
		'unknown';

	return `${scope}:ip:${ip}`;
}

/**
 * Rate limiter middleware
 * @param scope Scope identifier (e.g., "api", "auth")
 * @param config Rate limit configuration
 */
export function createRateLimiterMiddleware(
	scope: string,
	config: RateLimitConfig
): (request: Request, env: Env, ctx: ExecutionContext, next: NextFunction) => Promise<Response | null> {
	return async (request: Request, env: Env, ctx: ExecutionContext, next: NextFunction): Promise<Response | null> => {
		// Skip rate limiting for OPTIONS requests
		if (request.method === 'OPTIONS') {
			return next(request, env, ctx);
		}

		// Skip rate limiting for internal requests
		if (isInternalRequest(request)) {
			return next(request, env, ctx);
		}

		const req = request as IRequest;
		const identifier = resolveIdentifier(req, scope);

		try {
			// Get Durable Object instance for this identifier
			const id = env.RATE_LIMITER_DURABLE_OBJECT.idFromName(identifier);
			const stub = env.RATE_LIMITER_DURABLE_OBJECT.get(id);

			// console.log('[RateLimiter Middleware] Calling check for identifier:', identifier, 'config:', config);

			// Check rate limit - call the method on the stub
			// The stub acts as a proxy to the Durable Object instance
			const result: RateLimitResult = await (stub as any).check(config);
			// console.log('===================================================================');
			// console.log('[RateLimiter Middleware] Result:', result);
			// console.log('===================================================================');

			if (!result.allowed) {
				// Rate limit exceeded
				const retryAfterSeconds = Math.ceil(result.retryAfterMs / 1000);

				return new Response(
					JSON.stringify({
						error: 'TooManyRequestsException',
						message: 'Rate limit exceeded. Please try again later.',
						status: 429,
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': retryAfterSeconds.toString(),
							'X-RateLimit-Limit': result.limitMs.toString(),
							'X-RateLimit-Retry-After': result.retryAfterMs.toString(),
						},
					}
				);
			}

			// Request allowed, continue
			const response = await next(request, env, ctx);

			// Add rate limit headers to successful responses
			if (response) {
				const newResponse = new Response(response.body, response);
				newResponse.headers.set('X-RateLimit-Limit', result.limitMs.toString());
				newResponse.headers.set('X-RateLimit-Retry-After', '0');
				return newResponse;
			}

			return response;
		} catch (error) {
			// Fail-open: if rate limiter fails, allow the request
			console.error('Rate limiter error:', error);
			return next(request, env, ctx);
		}
	};
}
