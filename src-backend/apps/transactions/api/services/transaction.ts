import {
	CreateTransactionRequest,
	GetTransactionsFilters,
	GetTransactionsResponse,
	Transaction,
	TransactionResponse,
	UpdateTransactionRequest,
} from '@/shared';
import { BadRequestException } from '@/src-backend/apps/common';
import { CategoryNotFoundException, TransactionNotFoundException } from '@/src-backend/apps/transactions/exceptions/transaction';
import { initDbConnect } from '@/src-backend/db';

export async function createTransaction(env: Env, userId: number, transactionData: CreateTransactionRequest): Promise<Transaction> {
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
				updated_at,
				deleted_at
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
		.first<Transaction>();

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
): Promise<Transaction> {
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
		throw new BadRequestException('No fields to update');
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
			updated_at,
			deleted_at
	`;

	const result = await d1Client
		.prepare(updateQuery)
		.bind(...values)
		.first<Transaction>();

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

export async function getTransactionById(env: Env, userId: number, transactionId: number): Promise<TransactionResponse> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Always join with categories to get category info and validate ownership
	const result = await d1Client
		.prepare(
			`
			SELECT 
				t.id,
				t.user_id,
				t.category_id,
				t.amount,
				t.currency,
				t.description,
				t.occurred_at,
				t.created_at,
				t.updated_at,
				c.id as category_id_full,
				c.type as category_type,
				c.name as category_name,
				c.icon as category_icon,
				c.color as category_color
			FROM transactions t
			INNER JOIN categories c ON t.category_id = c.id AND c.deleted_at IS NULL
			WHERE t.id = ? AND t.user_id = ? AND t.deleted_at IS NULL
		`
		)
		.bind(transactionId, userId)
		.first<{
			id: number;
			user_id: number;
			category_id: number;
			amount: number;
			currency: string;
			description: string | null;
			occurred_at: number;
			created_at: number;
			updated_at: number;
			category_id_full: number;
			category_type: 'income' | 'expense';
			category_name: string;
			category_icon: string | null;
			category_color: string | null;
		}>();

	if (!result) {
		throw new TransactionNotFoundException('Transaction not found or not accessible');
	}

	// Transform to TransactionResponse with category object
	return {
		id: result.id,
		user_id: result.user_id,
		category_id: result.category_id,
		category: {
			id: result.category_id_full,
			type: result.category_type,
			name: result.category_name,
			icon: result.category_icon,
			color: result.category_color,
		},
		amount: result.amount,
		currency: result.currency,
		description: result.description,
		occurred_at: result.occurred_at,
		created_at: result.created_at,
		updated_at: result.updated_at,
	};
}

export async function getTransactions(env: Env, userId: number, filters: GetTransactionsFilters): Promise<GetTransactionsResponse> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Parse cursor if provided
	let cursorOccurredAt: number | null = null;
	let cursorId: number | null = null;
	if (filters.cursor) {
		try {
			const decoded = atob(filters.cursor);
			const [occurredAtStr, idStr] = decoded.split(':');
			cursorOccurredAt = parseInt(occurredAtStr, 10);
			cursorId = parseInt(idStr, 10);
			if (isNaN(cursorOccurredAt) || isNaN(cursorId)) {
				throw new BadRequestException('Invalid cursor format');
			}
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException('Invalid cursor format');
		}
	}

	// Validate and set limit (default 20, max 100)
	const limit = Math.min(Math.max(1, filters.limit || 20), 100);

	// Validate category_ids ownership if provided
	if (filters.category_ids && filters.category_ids.length > 0) {
		const placeholders = filters.category_ids.map(() => '?').join(',');
		const categoryCheck = await d1Client
			.prepare(
				`
				SELECT COUNT(*) as count
				FROM categories
				WHERE id IN (${placeholders})
				AND (user_id = ? OR user_id IS NULL)
				AND deleted_at IS NULL
			`
			)
			.bind(...filters.category_ids, userId)
			.first<{ count: number }>();

		if (!categoryCheck || categoryCheck.count !== filters.category_ids.length) {
			throw new CategoryNotFoundException('One or more categories not found or not accessible');
		}
	}

	// Build WHERE conditions - always validate user ownership
	const whereConditions: string[] = [
		't.user_id = ?',
		't.deleted_at IS NULL',
		'c.deleted_at IS NULL', // Ensure category is not deleted
		'(c.user_id = ? OR c.user_id IS NULL)', // Ensure category belongs to user or is default
	];
	const values: any[] = [userId, userId];

	// Date range filters
	if (filters.from !== undefined) {
		whereConditions.push('t.occurred_at >= ?');
		values.push(filters.from);
	}

	if (filters.to !== undefined) {
		whereConditions.push('t.occurred_at <= ?');
		values.push(filters.to);
	}

	// Category filter
	if (filters.category_ids && filters.category_ids.length > 0) {
		const placeholders = filters.category_ids.map(() => '?').join(',');
		whereConditions.push(`t.category_id IN (${placeholders})`);
		values.push(...filters.category_ids);
	}

	// Type filter
	if (filters.type) {
		whereConditions.push('c.type = ?');
		values.push(filters.type);
	}

	// Cursor pagination
	if (cursorOccurredAt !== null && cursorId !== null) {
		whereConditions.push('(t.occurred_at < ? OR (t.occurred_at = ? AND t.id < ?))');
		values.push(cursorOccurredAt, cursorOccurredAt, cursorId);
	}

	// Always join with categories to get category info
	const query = `
		SELECT 
			t.id,
			t.user_id,
			t.category_id,
			t.amount,
			t.currency,
			t.description,
			t.occurred_at,
			t.created_at,
			t.updated_at,
			c.id as category_id_full,
			c.type as category_type,
			c.name as category_name,
			c.icon as category_icon,
			c.color as category_color
		FROM transactions t
		INNER JOIN categories c ON t.category_id = c.id
		WHERE ${whereConditions.join(' AND ')}
		ORDER BY t.occurred_at DESC, t.id DESC
		LIMIT ?
	`;

	values.push(limit + 1); // Fetch one extra to determine if there's a next page

	const results = await d1Client
		.prepare(query)
		.bind(...values)
		.all<{
			id: number;
			user_id: number;
			category_id: number;
			amount: number;
			currency: string;
			description: string | null;
			occurred_at: number;
			created_at: number;
			updated_at: number;
			category_id_full: number;
			category_type: 'income' | 'expense';
			category_name: string;
			category_icon: string | null;
			category_color: string | null;
		}>();

	const rawTransactions = results.results || [];
	const hasNextPage = rawTransactions.length > limit;
	const rawTransactionsToReturn = hasNextPage ? rawTransactions.slice(0, limit) : rawTransactions;

	// Transform to TransactionResponse with category objects
	const transactions: TransactionResponse[] = rawTransactionsToReturn.map((row) => ({
		id: row.id,
		user_id: row.user_id,
		category_id: row.category_id,
		category: {
			id: row.category_id_full,
			type: row.category_type,
			name: row.category_name,
			icon: row.category_icon,
			color: row.category_color,
		},
		amount: row.amount,
		currency: row.currency,
		description: row.description,
		occurred_at: row.occurred_at,
		created_at: row.created_at,
		updated_at: row.updated_at,
	}));

	// Generate next cursor from the last item
	let nextCursor: string | null = null;
	if (hasNextPage && transactions.length > 0) {
		const lastTransaction = transactions[transactions.length - 1];
		const cursorData = `${lastTransaction.occurred_at}:${lastTransaction.id}`;
		nextCursor = btoa(cursorData);
	}

	return {
		transactions,
		next_cursor: nextCursor,
	};
}
