import {
	CreateTransactionRequest,
	GetTransactionsFilters,
	GetTransactionsResponse,
	TransactionResponse,
	UpdateTransactionRequest,
} from '@/shared';
import { ApiClient } from '../apiClient';

export const getTransactionsApi = async (filters: GetTransactionsFilters) => {
	const param = new URLSearchParams();
	if (filters.from) param.append('from', filters.from.toString());
	if (filters.to) param.append('to', filters.to.toString());
	if (filters.category_ids) param.append('category_ids', filters.category_ids.join(','));
	if (filters.type) param.append('type', filters.type);
	if (filters.limit) param.append('limit', filters.limit.toString());
	if (filters.cursor) param.append('cursor', filters.cursor);
	const queryString = param.toString();
	const url = `/api/transactions/private${queryString ? `?${queryString}` : ''}`;

	return await ApiClient.get<GetTransactionsResponse, null>(url, {}, true, true);
};

export const getTransactionByIdApi = async (id: number) => {
	return await ApiClient.get<TransactionResponse, null>(`/api/transactions/private/${id}`, {}, true, true);
};

export const createTransactionApi = async (data: CreateTransactionRequest) => {
	return await ApiClient.post<TransactionResponse, CreateTransactionRequest>(
		'/api/transactions/private',
		{ body: data },
		true,
		true,
	);
};

export const updateTransactionApi = async (id: number, body: UpdateTransactionRequest) => {
	return await ApiClient.put<TransactionResponse, UpdateTransactionRequest>(
		`/api/transactions/private/${id}`,
		{ body },
		true,
		true,
	);
};

export const deleteTransactionApi = async (id: number) => {
	return await ApiClient.delete<void, null>(`/api/transactions/private/${id}`, {}, true, true);
};
