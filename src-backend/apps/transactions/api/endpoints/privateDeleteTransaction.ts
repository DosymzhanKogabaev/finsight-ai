import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { deleteTransaction } from '@/src-backend/apps/transactions/api/services/transaction';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const PARAMS_SCHEMA = z.object({
	id: z.coerce.number().int().positive(),
}) satisfies z.ZodType<{ id: number }>;

/**
 * DELETE /api/transactions/private/:id
 * Delete (soft delete) a transaction for the authenticated user
 */
export class PrivateDeleteTransactionAPI extends OpenAPIRoute {
	schema = {
		request: {
			params: PARAMS_SCHEMA,
		},
		responses: {
			'204': {
				description: 'Transaction successfully deleted',
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
			const transactionId = data.params.id;

			// Delete transaction (user_id is taken from request.user.user_id)
			await deleteTransaction(env, request.user.user_id, transactionId);

			return new Response(null, { status: 204 });
		} catch (error) {
			console.error('Delete transaction API error:', error);
			return handleError(error);
		}
	}
}
