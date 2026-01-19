import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/shared';
import { ApiClient } from '../apiClient';

export const getCategoriesApi = async () => {
	return await ApiClient.get<CategoryResponse[], null>('/api/categories/private', {}, true, true);
};

export const getCategoryByIdApi = async (id: number) => {
	return await ApiClient.get<CategoryResponse, null>(`/api/categories/private/${id}`, {}, true, true);
};

export const createCategoryApi = async (data: CreateCategoryRequest) => {
	return await ApiClient.post<CategoryResponse, CreateCategoryRequest>(
		'/api/categories/private',
		{ body: data },
		true,
		true,
	);
};

export const updateCategoryApi = async (id: number, body: UpdateCategoryRequest) => {
	return await ApiClient.put<CategoryResponse, UpdateCategoryRequest>(
		`/api/categories/private/${id}`,
		{ body },
		true,
		true,
	);
};

export const deleteCategoryApi = async (id: number) => {
	return await ApiClient.delete<void, null>(`/api/categories/private/${id}`, {}, true, true);
};
