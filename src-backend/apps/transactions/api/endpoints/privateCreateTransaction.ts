import { CreateTransactionRequest, TransactionResponse } from '@/shared';
import { createTransaction } from '@/src-backend/apps/transactions/api/services/transaction';
import { BadRequestException, handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const REQUEST_BODY_SCHEMA = z.object({
	category_id: z.number().int().positive(),
	amount: z.number().int().positive(),
	currency: z.string().optional().default('KZT'),
	description: z.string().optional(),
	occurred_at: z.number().int().positive(),
}) satisfies z.ZodType<CreateTransactionRequest>;

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	user_id: z.number(),
	category_id: z.number(),
	amount: z.number(),
	currency: z.string(),
	description: z.string().nullable(),
	occurred_at: z.number(),
	created_at: z.number(),
	updated_at: z.number(),
}) satisfies z.ZodType<TransactionResponse>;

/**
 * POST /api/transactions/private
 * Create a new transaction for the authenticated user
 */
export class PrivateCreateTransactionAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: {
			'201': {
				description: 'Transaction successfully created',
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
			const transactionData = data.body;

			// Validate occurred_at is not in the future (optional validation)
			const now = Math.floor(Date.now() / 1000);
			if (transactionData.occurred_at > now) {
				throw new BadRequestException('Transaction date cannot be in the future');
			}

			// Create transaction (user_id is taken from request.user.user_id)
			const transaction = await createTransaction(env, request.user.user_id, transactionData);

			return Response.json(transaction, { status: 201 });
		} catch (error) {
			console.error('Create transaction API error:', error);
			return handleError(error);
		}
	}
}
