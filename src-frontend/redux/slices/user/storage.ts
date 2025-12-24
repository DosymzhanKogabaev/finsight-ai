import { AppStore } from '../../store';
import { UserState } from './types';
import { isTokenExpired } from './utils';

export const LOCAL_STORAGE_USER_KEY = 'redux_user';

export const onStoreChanged = (store: AppStore) => {
	const userState = store.getState().user;
	localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userState));
};

export const getUserStateFromLocalStorage = (): UserState | null => {
	const userState = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
	if (!userState) return null;

	const parsedState = JSON.parse(userState) as UserState;

	// Check if access token is expired
	if (parsedState.accessToken && isTokenExpired(parsedState.accessToken)) {
		// If refresh token is also expired, clear the state
		if (!parsedState.refreshToken || isTokenExpired(parsedState.refreshToken)) {
			return null;
		}
		// Access token expired but refresh token is valid - keep state but mark as not authenticated
		// The app will need to refresh the token on first API call
		parsedState.isAuthenticated = false;
	}

	return parsedState;
};
