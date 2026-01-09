import { GetTransactionsFilters, GetTransactionsResponse, TransactionResponse } from '@/shared';
import { handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { getTransactions } from '@/src-backend/apps/transactions/api/services/transaction';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const QUERY_SCHEMA = z.object({
	from: z.coerce.number().int().positive().optional(),
	to: z.coerce.number().int().positive().optional(),
	category_ids: z.array(z.coerce.number().int().positive()).optional(),
	type: z.enum(['income', 'expense']).optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
}) satisfies z.ZodType<GetTransactionsFilters>;

const CATEGORY_INFO_SCHEMA = z.object({
	id: z.number(),
	type: z.enum(['income', 'expense']),
	name: z.string(),
	icon: z.string().nullable(),
	color: z.string().nullable(),
});

const TRANSACTION_RESPONSE_SCHEMA = z.object({
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

const RESPONSE_SCHEMA = z.object({
	transactions: z.array(TRANSACTION_RESPONSE_SCHEMA),
	next_cursor: z.string().nullable(),
}) satisfies z.ZodType<GetTransactionsResponse>;

/**
 * GET /api/transactions/private
 * Get all transactions for the authenticated user with optional filters
 */
export class PrivateGetTransactionsAPI extends OpenAPIRoute {
	schema = {
		request: {
			query: QUERY_SCHEMA,
		},
		responses: {
			'200': {
				description: 'List of transactions',
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
			const query = data.query as GetTransactionsFilters;

			// Get transactions with filters
			const result = await getTransactions(env, request.user.user_id, query);

			return Response.json(result);
		} catch (error) {
			console.error('Get transactions API error:', error);
			return handleError(error);
		}
	}
}
