import { Category, UpdateCategoryRequest } from '@/shared';
import { updateCategory } from '@/src-backend/apps/categories/api/services/category';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const REQUEST_BODY_SCHEMA = z.object({
	type: z.enum(['income', 'expense']).optional(),
	name: z.string().min(1).max(100).optional(),
	icon: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	sort_order: z.number().int().min(0).optional(),
}) satisfies z.ZodType<UpdateCategoryRequest>;

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
 * PUT /api/categories/private/:id
 * Update a category for the authenticated user
 */
export class PrivateUpdateCategoryAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } }, params: PARAMS_SCHEMA },
		responses: {
			'200': {
				description: 'Category successfully updated',
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
			const updateData = data.body;
			const categoryId = data.params.id;

			// Update category (user_id is taken from request.user.user_id)
			const category = await updateCategory(env, request.user.user_id, categoryId, updateData);

			return Response.json(category);
		} catch (error) {
			console.error('Update category API error:', error);
			return handleError(error);
		}
	}
}
