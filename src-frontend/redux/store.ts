import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categories/categoriesSlice';
import transactionsReducer from './slices/transactions/transactionsSlice';
import { onStoreChanged } from './slices/user/storage';
import userReducer from './slices/user/userSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		transactions: transactionsReducer,
		categories: categoriesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

store.subscribe(() => {
	onStoreChanged(store);
});
