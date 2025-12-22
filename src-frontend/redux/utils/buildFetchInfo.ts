import { FetchInfo, FetchState } from '../types';

export const buildFetchInfo = (): FetchInfo => {
	return {
		status: FetchState.IDLE,
		error: null,
	};
};
