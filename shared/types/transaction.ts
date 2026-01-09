import { transactionsSchema } from '@/src-backend/db/schema/transactions';
import { CategoryInfo } from './category';

export type CreateTransactionRequest = {
	category_id: number;
	amount: number;
	currency?: string;
	description?: string;
	occurred_at?: number; // Unix timestamp
};

export type UpdateTransactionRequest = {
	category_id?: number;
	amount?: number;
	currency?: string;
	description?: string;
	occurred_at?: number; // Unix timestamp
};

export type Transaction = typeof transactionsSchema.$inferSelect;

export type TransactionResponse = Omit<Transaction, 'deleted_at'> & {
	category: CategoryInfo;
};

export type GetTransactionsFilters = {
	from?: number; // Unix timestamp
	to?: number; // Unix timestamp
	category_ids?: number[];
	type?: 'income' | 'expense';
	limit?: number; // default 20, max 100
	cursor?: string; // base64(last_occurred_at:last_id)
};

export type GetTransactionsResponse = {
	transactions: TransactionResponse[];
	next_cursor: string | null;
};
