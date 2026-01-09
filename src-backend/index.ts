import { IRequest } from 'itty-router';
import apiRouter from './apps/apiRouter';
import docsRouter from './apps/docsRouter';
import { RateLimiter } from './durable-objects/rateLimiter';
import { composeMiddlewares, Middleware } from './middlewareComposer';
import { cdnMiddleware, optionsMiddleware, serveAssetsMiddleware } from './middlewares';
import auth from './middlewares/jwtAuth';
import { createRateLimiterMiddleware } from './middlewares/rateLimiter';

// Export Durable Object for Cloudflare Workers
export { RateLimiter };

const middlewares: Middleware[] = [optionsMiddleware, cdnMiddleware, serveAssetsMiddleware];

function applyCors(response: Response, request: Request): Response {
	const origin = request.headers.get('Origin');
	if (!origin) {
		return response;
	}

	const newResponse = new Response(response.body, response);

	// Set comprehensive CORS headers
	newResponse.headers.set('Access-Control-Allow-Origin', origin);
	newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
	newResponse.headers.set('Access-Control-Allow-Methods', 'DELETE, GET, OPTIONS, PATCH, POST, PUT, HEAD');
	newResponse.headers.set('Access-Control-Allow-Headers', '*');
	newResponse.headers.set('Access-Control-Expose-Headers', '*');
	newResponse.headers.set('Vary', 'Origin');

	return newResponse;
}

async function serveApi(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | null> {
	const url = new URL(request.url);
	if (url.pathname.startsWith('/docs')) {
		return await docsRouter.fetch(request, env, ctx);
	}

	const response = await apiRouter.fetch(request, env, ctx);
	if (!response) {
		return null;
	}

	return response;
}

async function handleProtectedRoute(request: IRequest, env: Env, ctx: ExecutionContext, handler: Function): Promise<Response> {
	const authResult = await auth(request, env, ctx);

	if (authResult) {
		// Apply CORS to auth error responses
		return applyCors(authResult, request);
	}

	const userId = request.user?.user_id;

	if (!userId) {
		const errorResponse = new Response('user id is required', { status: 400 });
		return applyCors(errorResponse, request);
	}

	// Return handler response (CORS will be applied in main handler)
	return await handler(request, env, ctx);
}

// Rate limiters for different scopes
const apiRateLimiter = createRateLimiterMiddleware('api', {
	millisecondsPerRequest: 70, // ~14 requests per second
	gracePeriodMs: 5000,
});

const authRateLimiter = createRateLimiterMiddleware('auth', {
	millisecondsPerRequest: 200, // 5 requests per second (stricter for auth)
	gracePeriodMs: 5000,
});

export default {
	async fetch(request: IRequest, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			// Handle OPTIONS preflight requests early
			if (request.method === 'OPTIONS') {
				const optionsResponse = await optionsMiddleware(request, env, ctx, async () => {
					return new Response(null, { status: 200 });
				});
				if (optionsResponse) {
					return optionsResponse;
				}
			}

			const url = new URL(request.url);
			const isPrivateRoute = url.pathname.includes('private');
			const isAuthRoute = url.pathname.includes('/auth/');

			// Apply rate limiting (skip for localhost)
			const host = request.headers.get('Host');
			if (!host?.includes('localhost')) {
				// Use stricter rate limiter for auth routes
				const rateLimiter = isAuthRoute ? authRateLimiter : apiRateLimiter;
				const rateLimitResponse = await rateLimiter(request, env, ctx, async () => null);
				if (rateLimitResponse) {
					return applyCors(rateLimitResponse, request);
				}
			}

			const handler = await composeMiddlewares(middlewares, serveApi);

			const response = isPrivateRoute ? await handleProtectedRoute(request, env, ctx, handler) : await handler(request, env, ctx);

			return applyCors(response || new Response('Not found', { status: 404 }), request);
		} catch (error) {
			console.error(error);

			const errorResponse = new Response('Server error', { status: 500 });
			return applyCors(errorResponse, request);
		}
	},
};
