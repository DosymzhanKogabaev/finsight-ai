import { Category } from '@/shared';
import { getCategories } from '@/src-backend/apps/categories/api/services/category';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const QUERY_SCHEMA = z.object({
	type: z.enum(['income', 'expense']).optional(),
});

const RESPONSE_SCHEMA = z.array(
	z.object({
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
	})
) satisfies z.ZodType<Category[]>;

/**
 * GET /api/categories/private
 * Get all categories for the authenticated user (including default categories)
 */
export class PrivateGetCategoriesAPI extends OpenAPIRoute {
	schema = {
		request: {
			query: QUERY_SCHEMA,
		},
		responses: {
			'200': {
				description: 'List of categories',
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
			const query = data.query as { type?: 'income' | 'expense' };

			// Get categories (user_id is taken from request.user.user_id)
			const categories = await getCategories(env, request.user.user_id, query.type);

			return Response.json(categories);
		} catch (error) {
			console.error('Get categories API error:', error);
			return handleError(error);
		}
	}
}
