import { UserMeResponse } from '@/shared';
import { ApiClient } from '../apiClient';

export const getMeApi = async (): Promise<UserMeResponse> => {
	return await ApiClient.get<UserMeResponse, null>('/api/auth/private/me', {}, true, true);
};
