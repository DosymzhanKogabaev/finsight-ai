import { UserMeResponse } from '@/shared';
import { getUserById } from '@/src-backend/apps/auth/api/services/user';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	email: z.string(),
	full_name: z.string(),
	locale: z.string(),
	currency: z.string(),
	avatar_url: z.string().nullable(),
	subscription_plan: z.string(),
	subscription_status: z.string(),
	subscription_renew_at: z.number().nullable(),
	ai_usage_tokens: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
}) satisfies z.ZodType<UserMeResponse>;

/**
 * GET /api/private/auth/me
 * Get current authenticated user's information
 */
export class PrivateMeAPI extends OpenAPIRoute {
	schema = {
		responses: {
			'200': {
				description: 'Current user information',
				content: { 'application/json': { schema: RESPONSE_SCHEMA } },
			},
		},
		security: [{ BearerAuth: [] }],
	} as any;

	async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			if (!request.user?.user_id) {
				throw new UnauthorizedException('User not authenticated');
			}

			const user = await getUserById(env, request.user.user_id);
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			// Return user data (excluding password_hash and deleted_at)
			return {
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				locale: user.locale,
				currency: user.currency,
				avatar_url: user.avatar_url,
				subscription_plan: user.subscription_plan,
				subscription_status: user.subscription_status,
				subscription_renew_at: user.subscription_renew_at,
				ai_usage_tokens: user.ai_usage_tokens,
				created_at: user.created_at,
				updated_at: user.updated_at,
			};
		} catch (error) {
			console.error('Get me API error:', error);
			return handleError(error);
		}
	}
}
