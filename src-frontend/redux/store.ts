import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
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

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppStore = typeof store;

store.subscribe(() => {
	onStoreChanged(store);
});
