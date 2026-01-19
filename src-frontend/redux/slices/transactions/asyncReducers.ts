import { CreateTransactionRequest, GetTransactionsFilters, UpdateTransactionRequest } from '@/shared';
import {
	createTransactionApi,
	deleteTransactionApi,
	getTransactionByIdApi,
	getTransactionsApi,
	updateTransactionApi,
} from '@/src-frontend/api/services/transactions';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getTransactions = createAsyncThunk(
	'transactions/getTransactions',
	async (filters: GetTransactionsFilters, _thunkAPI) => {
		return await getTransactionsApi(filters);
	},
);

export const getTransactionById = createAsyncThunk('transactions/getTransactionById', async (id: number, _thunkAPI) => {
	return await getTransactionByIdApi(id);
});

export const createTransaction = createAsyncThunk(
	'transactions/createTransaction',
	async (body: CreateTransactionRequest, _thunkAPI) => {
		return await createTransactionApi(body);
	},
);

export const updateTransaction = createAsyncThunk(
	'transactions/updateTransaction',
	async ({ id, body }: { id: number; body: UpdateTransactionRequest }, _thunkAPI) => {
		return await updateTransactionApi(id, body);
	},
);

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (id: number, _thunkAPI) => {
	return await deleteTransactionApi(id);
});
