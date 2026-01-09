import { Category, CreateCategoryRequest } from '@/shared';
import { createCategory } from '@/src-backend/apps/categories/api/services/category';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const REQUEST_BODY_SCHEMA = z.object({
	type: z.enum(['income', 'expense']),
	name: z.string().min(1).max(100),
	icon: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	sort_order: z.number().int().min(0).optional(),
}) satisfies z.ZodType<CreateCategoryRequest>;

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
 * POST /api/categories/private
 * Create a new category for the authenticated user
 */
export class PrivateCreateCategoryAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: {
			'201': {
				description: 'Category successfully created',
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
			const categoryData = data.body;

			// Create category (user_id is taken from request.user.user_id)
			const category = await createCategory(env, request.user.user_id, categoryData);

			return Response.json(category, { status: 201 });
		} catch (error) {
			console.error('Create category API error:', error);
			return handleError(error);
		}
	}
}
