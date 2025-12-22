export enum FetchState {
	IDLE = 'idle',
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}
export type FetchInfo = {
	status: FetchState;
	error: any | null;
};
