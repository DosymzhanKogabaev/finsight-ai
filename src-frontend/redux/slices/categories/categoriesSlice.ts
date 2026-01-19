import { CategoryResponse } from '@/shared';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchState } from '../../types';
import { createAsyncReducers } from '../../utils/createAsyncReducers';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from './asyncReducers';
import { CategoriesState } from './types';

const DEFAULT_STATE: CategoriesState = {
	categories: [],
	getCategoriesInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	getCategoryInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	createCategoryInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	updateCategoryInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	deleteCategoryInfo: {
		status: FetchState.IDLE,
		error: null,
	},
};

const initialState: CategoriesState = DEFAULT_STATE;

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		clearCategories: (state) => {
			state.categories = [];
		},
	},
	extraReducers: (builder) => {
		createAsyncReducers<CategoriesState, CategoryResponse[]>({
			builder,
			asyncThunk: getCategories,
			infoKey: 'getCategoriesInfo',
			onFulfilled: (state, action) => {
				state.categories = action.payload;
			},
		});

		createAsyncReducers<CategoriesState, CategoryResponse>({
			builder,
			asyncThunk: getCategoryById,
			infoKey: 'getCategoryInfo',
		});

		createAsyncReducers<CategoriesState, CategoryResponse>({
			builder,
			asyncThunk: createCategory,
			infoKey: 'createCategoryInfo',
			onFulfilled: (state, action) => {
				state.categories = [...state.categories, action.payload];
			},
		});

		createAsyncReducers<CategoriesState, CategoryResponse>({
			builder,
			asyncThunk: updateCategory,
			infoKey: 'updateCategoryInfo',
			onFulfilled: (state, action) => {
				const index = state.categories.findIndex((c) => c.id === action.payload.id);
				if (index !== -1) {
					state.categories[index] = action.payload;
				}
			},
		});

		createAsyncReducers<CategoriesState, void>({
			builder,
			asyncThunk: deleteCategory,
			infoKey: 'deleteCategoryInfo',
			onFulfilled: (state, action) => {
				const deletedId = action.meta.arg as unknown as number;
				state.categories = state.categories.filter((c) => c.id !== deletedId);
			},
		});
	},
});

export const { clearCategories } = categoriesSlice.actions;

// Selectors
export const selectCategories = (state: RootState) => state.categories.categories;
export const selectGetCategoriesInfo = (state: RootState) => state.categories.getCategoriesInfo;
export const selectCreateCategoryInfo = (state: RootState) => state.categories.createCategoryInfo;
export const selectUpdateCategoryInfo = (state: RootState) => state.categories.updateCategoryInfo;
export const selectDeleteCategoryInfo = (state: RootState) => state.categories.deleteCategoryInfo;

export default categoriesSlice.reducer;
