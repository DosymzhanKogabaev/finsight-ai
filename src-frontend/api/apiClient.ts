import { RequestMethod } from '@/shared';
import i18n from '../i18n/config';
import { refreshAccessToken } from '../redux/slices/user/asyncReducers';
import { logout, selectAccessToken, selectRefreshToken } from '../redux/slices/user/userSlice';
import { isTokenExpired } from '../redux/slices/user/utils';
import { store } from '../redux/store';
import { isLiteralObject } from '../utils/isLiteralObject';

export const buildAuthorizationHeader = (accessToken: string) => {
	return `Bearer ${accessToken}`;
};

export class ErrorStatusCode extends Error {
	constructor(message: string, name: string, public statusCode: number) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
	}
}

export type ClientOptions<K> = Omit<RequestInit, 'method' | 'body' | 'headers'> & {
	body?: BodyInit | K;
	headers?: Record<string, string>;
};

export class ApiClient {
	private static isRefreshing = false;

	public static async fetch<T, K>(
		url: string,
		options: ClientOptions<K | null | undefined> = {},
		requestType: RequestMethod = RequestMethod.GET,
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		let headers = options.headers || {};

		// Add access token to headers
		if (useAccessToken) {
			let accessToken = selectAccessToken(store.getState());
			if (!accessToken) {
				throw new Error('Access token not found');
			}

			// Check if access token is expired and refresh proactively
			if (isTokenExpired(accessToken)) {
				const refreshToken = selectRefreshToken(store.getState());

				if (refreshToken && !isTokenExpired(refreshToken) && !this.isRefreshing) {
					this.isRefreshing = true;
					try {
						await store.dispatch(refreshAccessToken({ refresh_token: refreshToken })).unwrap();
						accessToken = selectAccessToken(store.getState());
						if (!accessToken) {
							throw new Error('Failed to refresh access token');
						}
						this.isRefreshing = false;
					} catch (refreshError) {
						this.isRefreshing = false;
						store.dispatch(logout());
						throw new Error('Token refresh failed');
					}
				} else {
					// Refresh token is also expired or missing
					store.dispatch(logout());
					throw new Error('Access token expired and refresh token is invalid');
				}
			}

			headers = {
				...headers,
				Authorization: buildAuthorizationHeader(accessToken),
			};
		}

		// Add language header
		if (useApplicationLanguage) {
			headers = { ...headers, 'Accept-Language': i18n.language };
		}

		// Set content type and accept headers (unless body is FormData)
		if (!(options.body instanceof FormData)) {
			if (!headers['Content-Type']) {
				headers = { ...headers, 'Content-Type': 'application/json' };
			}
			if (!headers['Accept']) {
				headers = { ...headers, Accept: 'application/json, text/plain, */*' };
			}
		}

		// Convert body to JSON string if it's an object or array
		let body = options.body;
		if (!(body instanceof FormData) && (isLiteralObject(body) || Array.isArray(body))) {
			body = JSON.stringify(body);
		}

		const fetchOptions: RequestInit = {
			...options,
			headers,
			method: requestType,
			body: body as BodyInit,
		};

		// Build final URL
		let apiPrefix: string = import.meta.env.VITE_API_URL;

		let finalUrl = apiPrefix ? `${apiPrefix}${url}` : url;

		try {
			const response = await fetch(finalUrl, fetchOptions);

			if (!response.ok) {
				const responseText = await response.text();
				let error: any;

				try {
					error = JSON.parse(responseText);
				} catch {
					error = { message: responseText };
				}

				// Handle 401 Unauthorized
				if (response.status === 401) {
					const refreshToken = selectRefreshToken(store.getState());

					if (refreshToken && !this.isRefreshing) {
						this.isRefreshing = true;

						// Check if refresh token is expired
						if (isTokenExpired(refreshToken)) {
							this.isRefreshing = false;
							// Logout user
							store.dispatch(logout());
						} else {
							// Refresh token is valid, try to refresh access token
							try {
								await store.dispatch(refreshAccessToken({ refresh_token: refreshToken })).unwrap();
								this.isRefreshing = false;
							} catch (refreshError) {
								this.isRefreshing = false;
								// Clear user state on refresh failure
								store.dispatch(logout());
							}
						}
					}
				}

				console.log('ERROR', error);
				throw new ErrorStatusCode(
					error.detail || error.message || error.error || response.statusText,
					error.error || response.statusText,
					response.status
				);
			}

			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				return {} as T;
			}

			const responseData = await response.json();

			return responseData as T;
		} catch (error) {
			// Log network errors
			if (error instanceof TypeError && error.message === 'Load failed') {
				console.error('Network error details:', {
					url: finalUrl,
					method: requestType,
					error: error.message,
					stack: error.stack,
				});
			}

			throw error;
		}
	}

	public static async get<T, K>(
		url: string,
		options: ClientOptions<K> = {},
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		return await this.fetch(url, options, RequestMethod.GET, useAccessToken, useApplicationLanguage);
	}

	public static async post<T, K>(
		url: string,
		options: ClientOptions<K> = {},
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		return await this.fetch(url, options, RequestMethod.POST, useAccessToken, useApplicationLanguage);
	}

	public static async put<T, K>(
		url: string,
		options: ClientOptions<K> = {},
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		return await this.fetch(url, options, RequestMethod.PUT, useAccessToken, useApplicationLanguage);
	}

	public static async delete<T, K>(
		url: string,
		options: ClientOptions<K> = {},
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		return await this.fetch(url, options, RequestMethod.DELETE, useAccessToken, useApplicationLanguage);
	}

	public static async patch<T, K>(
		url: string,
		options: ClientOptions<K> = {},
		useAccessToken: boolean = true,
		useApplicationLanguage: boolean = true
	): Promise<T> {
		return await this.fetch(url, options, RequestMethod.PATCH, useAccessToken, useApplicationLanguage);
	}
}

export default ApiClient;
