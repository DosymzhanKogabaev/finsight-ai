import { CreateCategoryRequest, UpdateCategoryRequest } from '@/shared';
import {
	createCategoryApi,
	deleteCategoryApi,
	getCategoriesApi,
	getCategoryByIdApi,
	updateCategoryApi,
} from '@/src-frontend/api/services/categories';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCategories = createAsyncThunk('categories/getCategories', async (_: void, _thunkAPI) => {
	return await getCategoriesApi();
});

export const getCategoryById = createAsyncThunk('categories/getCategoryById', async (id: number, _thunkAPI) => {
	return await getCategoryByIdApi(id);
});

export const createCategory = createAsyncThunk(
	'categories/createCategory',
	async (body: CreateCategoryRequest, _thunkAPI) => {
		return await createCategoryApi(body);
	},
);

export const updateCategory = createAsyncThunk(
	'categories/updateCategory',
	async ({ id, body }: { id: number; body: UpdateCategoryRequest }, _thunkAPI) => {
		return await updateCategoryApi(id, body);
	},
);

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id: number, _thunkAPI) => {
	return await deleteCategoryApi(id);
});
