import {
	LoginUserRequest,
	LoginUserResponse,
	RefreshAccessTokenRequest,
	RefreshAccessTokenResponse,
	RegisterUserRequest,
	RegisterUserResponse,
} from '@/shared';
import { ApiClient } from '../apiClient';

export const loginApi = async (body: LoginUserRequest): Promise<LoginUserResponse> => {
	return await ApiClient.post<LoginUserResponse, LoginUserRequest>(
		'/api/auth/public/login',
		{
			body,
		},
		false,
		true
	);
};

export const registerApi = async (body: RegisterUserRequest): Promise<RegisterUserResponse> => {
	return await ApiClient.post<RegisterUserResponse, RegisterUserRequest>(
		'/api/auth/public/register',
		{
			body,
		},
		false,
		true
	);
};

export const refreshAccessTokenApi = async (body: RefreshAccessTokenRequest): Promise<RefreshAccessTokenResponse> => {
	return await ApiClient.post<RefreshAccessTokenResponse, RefreshAccessTokenRequest>(
		'/api/auth/public/refresh',
		{
			body,
		},
		false,
		true
	);
};
