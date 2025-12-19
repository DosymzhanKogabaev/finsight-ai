import { refreshAccessToken } from '@/src-backend/apps/auth/api/services/jwt';
import { BadRequestException, handleError } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const REQUEST_BODY_SCHEMA = z.object({
	refresh_token: z.string(),
});

const RESPONSE_SCHEMA = z.object({
	access_token: z.string(),
});

/**
 * POST /api/public/auth/refresh
 * Refresh access token using refresh token
 */
export class PublicRefreshAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: {
			'200': {
				description: 'Access token refreshed successfully',
				content: { 'application/json': { schema: RESPONSE_SCHEMA } },
			},
		},
	} as any;

	async handle(_request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const refreshToken = (data.body as { refresh_token: string }).refresh_token;

			if (!refreshToken) {
				throw new BadRequestException('Refresh token is required');
			}

			// Refresh the access token
			const newAccessToken = await refreshAccessToken(env, refreshToken);

			const response = {
				access_token: newAccessToken,
			};
			return Response.json(response);
		} catch (error) {
			console.error('Refresh token API error:', error);
			return handleError(error);
		}
	}
}
