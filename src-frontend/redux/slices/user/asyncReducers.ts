import { LoginUserRequest, RefreshAccessTokenRequest, RegisterUserRequest } from '@/shared';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, refreshAccessTokenApi, registerApi } from '../../../api/services/auth';
import { getMeApi } from '@/src-frontend/api';

export const loginUser = createAsyncThunk('user/loginUser', async (params: LoginUserRequest, _thunkAPI) => {
	return await loginApi(params);
});

export const registerUser = createAsyncThunk('user/registerUser', async (params: RegisterUserRequest, _thunkAPI) => {
	return await registerApi(params);
});

export const refreshAccessToken = createAsyncThunk('user/refreshAccessToken', async (params: RefreshAccessTokenRequest, _thunkAPI) => {
	return await refreshAccessTokenApi(params);
});

export const getMe = createAsyncThunk('user/getMe', async (_params: void, _thunkAPI) => {
	return await getMeApi();
});
