import { CreateTransactionRequest, TransactionResponse, UpdateTransactionRequest } from '@/shared';
import { CategoryNotFoundException, TransactionNotFoundException } from '@/src-backend/apps/transactions/exceptions/transaction';
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
			RETURNING 
				id,
				user_id,
				category_id,
				amount,
				currency,
				description,
				occurred_at,
				created_at,
				updated_at
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

export async function updateTransaction(
	env: Env,
	userId: number,
	transactionId: number,
	updateData: UpdateTransactionRequest
): Promise<TransactionResponse> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Single query: UPDATE with validation in WHERE clause
	// Validates transaction ownership, category (if updating), and updates in one go
	const updates: string[] = [];
	const values: any[] = [];
	const whereConditions: string[] = [];

	// Build SET clause and collect values for SET
	const setValues: any[] = [];

	if (updateData.category_id !== undefined) {
		updates.push('category_id = ?');
		setValues.push(updateData.category_id);
		// Add category validation to WHERE clause
		whereConditions.push(`EXISTS (
			SELECT 1 FROM categories
			WHERE id = ?
			AND (user_id = ? OR user_id IS NULL)
			AND deleted_at IS NULL
		)`);
	}

	if (updateData.amount !== undefined) {
		updates.push('amount = ?');
		setValues.push(updateData.amount);
	}

	if (updateData.currency !== undefined) {
		updates.push('currency = ?');
		setValues.push(updateData.currency);
	}

	if (updateData.description !== undefined) {
		updates.push('description = ?');
		setValues.push(updateData.description || null);
	}

	if (updateData.occurred_at !== undefined) {
		updates.push('occurred_at = ?');
		setValues.push(updateData.occurred_at);
	}

	// If no fields to update, just validate transaction exists and return it
	if (updates.length === 0) {
		const result = await d1Client
			.prepare(
				`
				SELECT 
					id,
					user_id,
					category_id,
					amount,
					currency,
					description,
					occurred_at,
					created_at,
					updated_at
				FROM transactions
				WHERE id = ? AND user_id = ? AND deleted_at IS NULL
			`
			)
			.bind(transactionId, userId)
			.first<TransactionResponse>();

		if (!result) {
			throw new TransactionNotFoundException('Transaction not found or not accessible');
		}

		return result;
	}

	// Add updated_at
	updates.push('updated_at = unixepoch()');

	// Build WHERE clause: transaction must exist, belong to user, not be deleted
	// AND category must be valid (if category_id is being updated)
	whereConditions.push('id = ?');
	whereConditions.push('user_id = ?');
	whereConditions.push('deleted_at IS NULL');

	// Build values array in correct order: SET values first, then WHERE values
	// WHERE values: category_id and userId (if category_id is being updated), then transactionId and userId
	const whereValues: any[] = [];
	if (updateData.category_id !== undefined) {
		whereValues.push(updateData.category_id, userId);
	}
	whereValues.push(transactionId, userId);

	// Combine: SET values first, then WHERE values
	values.push(...setValues, ...whereValues);

	// Execute single UPDATE query with all validations
	const updateQuery = `
		UPDATE transactions
		SET ${updates.join(', ')}
		WHERE ${whereConditions.join(' AND ')}
		RETURNING 
			id,
			user_id,
			category_id,
			amount,
			currency,
			description,
			occurred_at,
			created_at,
			updated_at
	`;

	const result = await d1Client
		.prepare(updateQuery)
		.bind(...values)
		.first<TransactionResponse>();

	if (!result) {
		// Could be transaction not found OR category not found
		// Check if transaction exists to provide better error message
		const transactionCheck = await d1Client
			.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ? AND deleted_at IS NULL')
			.bind(transactionId, userId)
			.first<{ id: number }>();

		if (!transactionCheck) {
			throw new TransactionNotFoundException('Transaction not found or not accessible');
		}

		// Transaction exists, so the issue is likely category validation
		// Check category details for debugging
		if (updateData.category_id !== undefined) {
			const categoryCheck = await d1Client
				.prepare('SELECT id, user_id, deleted_at FROM categories WHERE id = ?')
				.bind(updateData.category_id)
				.first<{ id: number; user_id: number | null; deleted_at: number | null }>();

			if (!categoryCheck) {
				throw new CategoryNotFoundException(`Category with id ${updateData.category_id} does not exist`);
			}

			if (categoryCheck.deleted_at !== null) {
				throw new CategoryNotFoundException(`Category with id ${updateData.category_id} is deleted`);
			}

			if (categoryCheck.user_id !== null && categoryCheck.user_id !== userId) {
				throw new CategoryNotFoundException(`Category with id ${updateData.category_id} belongs to another user`);
			}
		}

		throw new CategoryNotFoundException('Category not found or not accessible');
	}

	return result;
}

export async function deleteTransaction(env: Env, userId: number, transactionId: number): Promise<void> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Soft delete: set deleted_at timestamp
	const result = await d1Client
		.prepare(
			`
			UPDATE transactions
			SET deleted_at = unixepoch()
			WHERE id = ? AND user_id = ? AND deleted_at IS NULL
			RETURNING id
		`
		)
		.bind(transactionId, userId)
		.first<{ id: number }>();

	if (!result) {
		throw new TransactionNotFoundException('Transaction not found or not accessible');
	}
}
