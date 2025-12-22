import { UserMeResponse } from '@/shared';
import { ApiClient } from '../apiClient';

export const getMeApi = async (): Promise<UserMeResponse> => {
	return await ApiClient.get<UserMeResponse, null>('/api/private/auth/me', {}, true, true);
};
