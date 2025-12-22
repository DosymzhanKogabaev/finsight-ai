import { AppStore } from '../../store';
import { UserState } from './types';

export const LOCAL_STORAGE_USER_KEY = 'redux_user';

export const onStoreChanged = (store: AppStore) => {
	const userState = store.getState().user;
	localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userState));
};

export const getUserStateFromLocalStorage = (): UserState | null => {
	const userState = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
	return userState ? (JSON.parse(userState) as UserState) : null;
};
