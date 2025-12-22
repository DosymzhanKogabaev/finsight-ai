import { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { FetchState } from '../types';

type HandlePendingParams<T> = {
	state: T;
	infoKey: keyof T;
};
const handlePending = <T>({ state, infoKey }: HandlePendingParams<T>) => {
	const currentState = state[infoKey] as any;
	state[infoKey] = {
		...currentState,
		status: FetchState.LOADING,
		error: null,
	} as T[keyof T];
};

type HandleRejectedParams<T> = {
	state: T;
	infoKey: keyof T;
	error: any;
	asyncThunkName?: string;
};
const handleRejected = <T>({ state, infoKey, error, asyncThunkName }: HandleRejectedParams<T>) => {
	const currentState = state[infoKey] as any;

	// Игнорируем AbortError - это нормальная отмена запроса
	if (error?.name === 'AbortError') {
		state[infoKey] = {
			...currentState,
			status: FetchState.IDLE,
			error: null,
		} as T[keyof T];

		return;
	}

	// Создаем копию ошибки для безопасного логирования
	const errorInfo = {
		infoKey: String(infoKey),
		errorName: error?.name || 'UnknownError',
		errorMessage: error?.message || 'Unknown error',
		errorStack: error?.stack || '',
		timestamp: new Date().toISOString(),
	};

	// Используем setTimeout чтобы логирование происходило асинхронно
	// и не блокировало обработку состояния Redux
	setTimeout(() => {
		// console.log(error, 'error');
		console.error(`Redux AsyncThunk Error [${asyncThunkName || 'Unknown'}]:`, errorInfo);
	}, 0);

	state[infoKey] = {
		...currentState,
		status: FetchState.ERROR,
		error: {
			name: error?.name || 'UnknownError',
			message: error?.message || error?.stack || 'Unknown error',
		},
	} as T[keyof T];
};

type HandleFulfilledParams<T> = {
	state: T;
	infoKey: keyof T;
	action: any;
};
const handleFulfilled = <T>({ state, infoKey }: HandleFulfilledParams<T>) => {
	const currentState = state[infoKey] as any;
	state[infoKey] = {
		...currentState,
		status: FetchState.SUCCESS,
		error: null,
	} as T[keyof T];
};

type CreateAsyncReducersParams<T, K> = {
	builder: any;
	asyncThunk: any;
	infoKey: keyof T;
	onFulfilled?: (
		state: T,
		action: {
			payload: K;
			meta: { arg: K };
			type: string;
		}
	) => void;
	onRejected?: (state: T, action: PayloadAction<unknown, string, never, SerializedError>) => void;
	onPending?: (state: T) => void;
};
export const createAsyncReducers = <T, K>({
	builder,
	asyncThunk,
	infoKey,
	onFulfilled,
	onRejected,
	onPending,
}: CreateAsyncReducersParams<T, K>) => {
	builder
		.addCase(asyncThunk.pending, (state: T) => {
			handlePending({ state, infoKey });
			onPending?.(state);
		})
		.addCase(asyncThunk.fulfilled, (state: T, action: any) => {
			handleFulfilled({ state, infoKey, action });
			onFulfilled?.(state, action);
		})
		.addCase(asyncThunk.rejected, (state: T, action: any) => {
			handleRejected({
				state,
				infoKey,
				error: action.error,
				asyncThunkName: asyncThunk.typePrefix,
			});
			onRejected?.(state, action);
		});
};
