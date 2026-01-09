import { TransactionResponse } from '@/shared';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { getTransactionById } from '@/src-backend/apps/transactions/api/services/transaction';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const PARAMS_SCHEMA = z.object({
	id: z.coerce.number().int().positive(),
}) satisfies z.ZodType<{ id: number }>;

const CATEGORY_INFO_SCHEMA = z.object({
	id: z.number(),
	type: z.enum(['income', 'expense']),
	name: z.string(),
	icon: z.string().nullable(),
	color: z.string().nullable(),
});

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	user_id: z.number(),
	category_id: z.number(),
	category: CATEGORY_INFO_SCHEMA,
	amount: z.number(),
	currency: z.string(),
	description: z.string().nullable(),
	occurred_at: z.number(),
	created_at: z.number(),
	updated_at: z.number(),
}) satisfies z.ZodType<TransactionResponse>;

/**
 * GET /api/transactions/private/:id
 * Get a single transaction by ID for the authenticated user
 */
export class PrivateGetTransactionAPI extends OpenAPIRoute {
	schema = {
		request: {
			params: PARAMS_SCHEMA,
		},
		responses: {
			'200': {
				description: 'Transaction found',
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
			const transactionId = data.params.id;

			// Get transaction (user_id is taken from request.user.user_id)
			const transaction = await getTransactionById(env, request.user.user_id, transactionId);

			return Response.json(transaction);
		} catch (error) {
			console.error('Get transaction API error:', error);
			return handleError(error);
		}
	}
}
