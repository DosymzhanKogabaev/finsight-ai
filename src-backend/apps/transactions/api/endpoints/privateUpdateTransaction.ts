import { Transaction, UpdateTransactionRequest } from '@/shared';
import { BadRequestException, handleError, UnauthorizedException } from '@/src-backend/apps/common';
import { updateTransaction } from '@/src-backend/apps/transactions/api/services/transaction';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';

const REQUEST_BODY_SCHEMA = z.object({
	category_id: z.number().int().positive().optional(),
	amount: z.number().int().positive().optional(),
	currency: z.string().optional().default('KZT'),
	description: z.string().optional(),
	occurred_at: z.number().int().positive().optional(),
}) satisfies z.ZodType<UpdateTransactionRequest>;

const PARAMS_SCHEMA = z.object({
	id: z.coerce.number().int().positive(),
}) satisfies z.ZodType<{ id: number }>;

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
	deleted_at: z.number().nullable(),
}) satisfies z.ZodType<Transaction>;

/**
 * PUT /api/transactions/private/:id
 * Update a transaction for the authenticated user
 */
export class PrivateUpdateTransactionAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } }, params: PARAMS_SCHEMA },
		responses: {
			'200': {
				description: 'Transaction successfully updated',
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
			const transactionId = data.params.id;

			// Validate occurred_at is not in the future if provided
			if (updateData.occurred_at !== undefined) {
				const now = Math.floor(Date.now() / 1000);
				if (updateData.occurred_at > now) {
					throw new BadRequestException('Transaction date cannot be in the future');
				}
			}

			// Update transaction (user_id is taken from request.user.user_id)
			const transaction = await updateTransaction(env, request.user.user_id, transactionId, updateData);

			return Response.json(transaction);
		} catch (error) {
			console.error('Update transaction API error:', error);
			return handleError(error);
		}
	}
}
