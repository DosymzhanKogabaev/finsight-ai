import { TurnstileVerificationFailedException } from '@/src-backend/apps/auth/exceptions/user';
import { BadRequestException, handleError } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';

interface TurnstileResponse {
	success: boolean;
	'error-codes'?: string[];
}

/**
 * Base class for OpenAPI routes that require Turnstile verification
 * Extend this class instead of OpenAPIRoute to automatically verify Turnstile tokens
 */
export abstract class OpenAPIRouteWithTurnstile extends OpenAPIRoute {
	async handle(request: IRequest, env: Env, ctx: ExecutionContext): Promise<Response | object> {
		try {
			// Verify turnstile before handling the request
			await this.verifyTurnstile(request, env);

			// Call the actual handler implemented by the subclass
			return this.handleAfterTurnstile(request, env, ctx);
		} catch (error) {
			console.error('Turnstile verification error:', error);
			return handleError(error);
		}
	}

	/**
	 * Subclasses should implement this method instead of handle()
	 */
	abstract handleAfterTurnstile(request: IRequest, env: Env, ctx: ExecutionContext): Promise<Response | object>;

	private async verifyTurnstile(request: IRequest, env: Env): Promise<void> {
		// Clone the request to read the body without consuming it
		const clonedRequest = request.clone();
		const body = await clonedRequest.json() as any;

		// Check if turnstile_token exists in the body
		if (!body.turnstile_token) {
			throw new BadRequestException('Missing turnstile_token in request body');
		}

		// Get client IP
		const ip = (request?.cf?.ip as string) ||
				   request.headers.get('CF-Connecting-IP') ||
				   request.headers.get('X-Forwarded-For') ||
				   '';

		// Verify the Turnstile token
		const isValid = await verifyTurnstileToken(
			env.TURNSTILE_SECRET_KEY,
			body.turnstile_token,
			ip
		);

		if (!isValid.success) {
			const errorMessage = isValid['error-codes']?.join(', ') || 'Invalid captcha token';
			throw new TurnstileVerificationFailedException(errorMessage);
		}

		// Store verification result in request object for downstream use
		request.turnstileVerified = true;
	}
}

async function verifyTurnstileToken(
	secretKey: string,
	token: string,
	ip: string
): Promise<TurnstileResponse> {
	const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);
	formData.append('remoteip', ip || '');

	try {
		const response = await fetch(VERIFY_URL, {
			method: 'POST',
			body: formData,
		});

		const data = await response.json() as TurnstileResponse;
		return data;
	} catch (error) {
		console.error('Turnstile API error:', error);
		return {
			success: false,
			'error-codes': ['verification-failed']
		};
	}
}
