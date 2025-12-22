import { LoginUserResponse, RefreshAccessTokenResponse, RegisterUserResponse, UserMeResponse } from '@/shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchState } from '../../types';
import { createAsyncReducers } from '../../utils/createAsyncReducers';
import { loginUser, refreshAccessToken, registerUser } from './asyncReducers';
import { getUserStateFromLocalStorage } from './storage';
import { UserState } from './types';

const DEFAULT_STATE: UserState = {
	currentUser: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	loginInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	registerInfo: {
		status: FetchState.IDLE,
		error: null,
	},
	refreshAccessTokenInfo: {
		status: FetchState.IDLE,
		error: null,
	},
};

const initialState: UserState = getUserStateFromLocalStorage() || DEFAULT_STATE;

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;
			localStorage.setItem('access_token', action.payload.accessToken);
			localStorage.setItem('refresh_token', action.payload.refreshToken);
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
			localStorage.setItem('access_token', action.payload);
		},
		setCurrentUser: (state, action: PayloadAction<UserMeResponse>) => {
			state.currentUser = action.payload;
		},
		logout: (state) => {
			state.currentUser = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
		},
	},
	extraReducers: (builder) => {
		createAsyncReducers<UserState, LoginUserResponse>({
			builder,
			asyncThunk: loginUser,
			infoKey: 'loginInfo',
			onFulfilled: (state, action) => {
				state.accessToken = action.payload.access_token;
				state.refreshToken = action.payload.refresh_token;
				state.isAuthenticated = true;
			},
		});
		createAsyncReducers<UserState, RegisterUserResponse>({
			builder,
			asyncThunk: registerUser,
			infoKey: 'registerInfo',
			onFulfilled: (state, action) => {
				state.accessToken = action.payload.access_token;
				state.refreshToken = action.payload.refresh_token;
				state.isAuthenticated = true;
			},
		});
		createAsyncReducers<UserState, RefreshAccessTokenResponse>({
			builder,
			asyncThunk: refreshAccessToken,
			infoKey: 'refreshAccessTokenInfo',
			onFulfilled: (state, action) => {
				state.accessToken = action.payload.access_token;
			},
		});
	},
});

export const { setTokens, setAccessToken, setCurrentUser, logout } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectRefreshToken = (state: RootState) => state.user.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
