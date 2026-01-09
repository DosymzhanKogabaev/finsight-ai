import { Category } from '@/shared';
import { getCategoryById } from '@/src-backend/apps/categories/api/services/category';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const PARAMS_SCHEMA = z.object({
	id: z.coerce.number().int().positive(),
}) satisfies z.ZodType<{ id: number }>;

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	user_id: z.number().nullable(),
	type: z.enum(['income', 'expense']),
	name: z.string(),
	icon: z.string().nullable(),
	color: z.string().nullable(),
	sort_order: z.number(),
	created_at: z.number(),
	updated_at: z.number(),
	deleted_at: z.number().nullable(),
}) satisfies z.ZodType<Category>;

/**
 * GET /api/categories/private/:id
 * Get a single category by ID for the authenticated user
 */
export class PrivateGetCategoryAPI extends OpenAPIRoute {
	schema = {
		request: {
			params: PARAMS_SCHEMA,
		},
		responses: {
			'200': {
				description: 'Category found',
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

			const data = await this.getValidatedData<typeof this.schema>();
			const categoryId = data.params.id;

			// Get category (user_id is taken from request.user.user_id)
			const category = await getCategoryById(env, request.user.user_id, categoryId);

			return Response.json(category);
		} catch (error) {
			console.error('Get category API error:', error);
			return handleError(error);
		}
	}
}
