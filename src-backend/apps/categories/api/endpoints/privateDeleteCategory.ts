import { deleteCategory } from '@/src-backend/apps/categories/api/services/category';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const PARAMS_SCHEMA = z.object({
	id: z.coerce.number().int().positive(),
}) satisfies z.ZodType<{ id: number }>;

/**
 * DELETE /api/categories/private/:id
 * Delete (soft delete) a category for the authenticated user
 */
export class PrivateDeleteCategoryAPI extends OpenAPIRoute {
	schema = {
		request: {
			params: PARAMS_SCHEMA,
		},
		responses: {
			'204': {
				description: 'Category successfully deleted',
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

			// Delete category (user_id is taken from request.user.user_id)
			await deleteCategory(env, request.user.user_id, categoryId);

			return new Response(null, { status: 204 });
		} catch (error) {
			console.error('Delete category API error:', error);
			return handleError(error);
		}
	}
}
