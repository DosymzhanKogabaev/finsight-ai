import { UserMeResponse } from '@/shared';
import { FetchInfo } from '../../types';

export interface UserState {
	currentUser: UserMeResponse | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	loginInfo: FetchInfo;
	registerInfo: FetchInfo;
	refreshAccessTokenInfo: FetchInfo;
	getMeInfo: FetchInfo;
}
