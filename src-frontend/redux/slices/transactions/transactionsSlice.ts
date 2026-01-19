import { GetTransactionsResponse, TransactionResponse } from '@/shared';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchState } from '../../types';
import { createAsyncReducers } from '../../utils/createAsyncReducers';
import {
	createTransaction,
	deleteTransaction,
	getTransactionById,
	getTransactions,
	updateTransaction,
} from './asyncReducers';
import { TransactionsState } from './types';

const DEFAULT_STATE: TransactionsState = {
	transactions: [],
	nextCursor: null,
	getTransactionsInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	getTransactionInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	createTransactionInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	updateTransactionInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	deleteTransactionInfo: {
		status: FetchState.IDLE,
		error: null,
	},
};

const initialState: TransactionsState = DEFAULT_STATE;

export const transactionsSlice = createSlice({
	name: 'transactions',
	initialState,
	reducers: {
		clearTransactions: (state) => {
			state.transactions = [];
			state.nextCursor = null;
		},
	},
	extraReducers: (builder) => {
		createAsyncReducers<TransactionsState, GetTransactionsResponse>({
			builder,
			asyncThunk: getTransactions,
			infoKey: 'getTransactionsInfo',
			onFulfilled: (state, action) => {
				// Append or replace based on cursor presence
				const filters = action.meta.arg;
				if (filters && 'cursor' in filters && filters.cursor) {
					state.transactions = [...state.transactions, ...action.payload.transactions];
				} else {
					state.transactions = action.payload.transactions;
				}
				state.nextCursor = action.payload.next_cursor;
			},
		});

		createAsyncReducers<TransactionsState, TransactionResponse>({
			builder,
			asyncThunk: getTransactionById,
			infoKey: 'getTransactionInfo',
		});

		createAsyncReducers<TransactionsState, TransactionResponse>({
			builder,
			asyncThunk: createTransaction,
			infoKey: 'createTransactionInfo',
			onFulfilled: (state, action) => {
				// Prepend new transaction
				state.transactions = [action.payload, ...state.transactions];
			},
		});

		createAsyncReducers<TransactionsState, TransactionResponse>({
			builder,
			asyncThunk: updateTransaction,
			infoKey: 'updateTransactionInfo',
			onFulfilled: (state, action) => {
				// Update transaction in list
				const index = state.transactions.findIndex((t) => t.id === action.payload.id);
				if (index !== -1) {
					state.transactions[index] = action.payload;
				}
			},
		});

		createAsyncReducers<TransactionsState, void>({
			builder,
			asyncThunk: deleteTransaction,
			infoKey: 'deleteTransactionInfo',
			onFulfilled: (state, action) => {
				// Remove transaction from list
				const deletedId = action.meta.arg as unknown as number;
				state.transactions = state.transactions.filter((t) => t.id !== deletedId);
			},
		});
	},
});

export const { clearTransactions } = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectNextCursor = (state: RootState) => state.transactions.nextCursor;
export const selectGetTransactionsInfo = (state: RootState) => state.transactions.getTransactionsInfo;
export const selectCreateTransactionInfo = (state: RootState) => state.transactions.createTransactionInfo;
export const selectUpdateTransactionInfo = (state: RootState) => state.transactions.updateTransactionInfo;
export const selectDeleteTransactionInfo = (state: RootState) => state.transactions.deleteTransactionInfo;

export default transactionsSlice.reducer;
