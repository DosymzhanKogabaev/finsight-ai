import { CreateTransactionRequest, TransactionResponse } from '@/shared';
import { CategoryNotFoundException } from '@/src-backend/apps/transactions/exceptions/transaction';
import { initDbConnect } from '@/src-backend/db';

export async function createTransaction(env: Env, userId: number, transactionData: CreateTransactionRequest): Promise<TransactionResponse> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Single query: INSERT with validation using INSERT ... SELECT WHERE EXISTS
	// This validates the category exists and is accessible, then inserts the transaction
	const currency = transactionData.currency || 'KZT';
	const description = transactionData.description || null;

	const result = await d1Client
		.prepare(
			`
			INSERT INTO transactions (
				user_id,
				category_id,
				amount,
				currency,
				description,
				occurred_at,
				created_at,
				updated_at
			)
			SELECT
				?,
				?,
				?,
				?,
				?,
				?,
				unixepoch(),
				unixepoch()
			WHERE EXISTS (
				SELECT 1 FROM categories
				WHERE id = ?
				AND (user_id = ? OR user_id IS NULL)
				AND deleted_at IS NULL
			)
			RETURNING *
		`
		)
		.bind(
			userId,
			transactionData.category_id,
			transactionData.amount,
			currency,
			description,
			transactionData.occurred_at,
			transactionData.category_id, // For WHERE EXISTS check
			userId // For WHERE EXISTS check
		)
		.first<TransactionResponse>();

	if (!result) {
		throw new CategoryNotFoundException('Category not found or not accessible');
	}

	return result;
}
