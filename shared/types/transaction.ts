export type CreateTransactionRequest = {
	category_id: number;
	amount: number;
	currency?: string;
	description?: string;
	occurred_at: number; // Unix timestamp
};

export type TransactionResponse = {
	id: number;
	user_id: number;
	category_id: number;
	amount: number;
	currency: string;
	description: string | null;
	occurred_at: number;
	created_at: number;
	updated_at: number;
};
