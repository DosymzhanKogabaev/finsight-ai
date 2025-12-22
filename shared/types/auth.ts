export type LoginUserRequest = {
	email: string;
	password: string;
};

export type LoginUserResponse = {
	access_token: string;
	refresh_token: string;
};

export type RegisterUserRequest = {
	email: string;
	password: string;
	full_name: string;
	turnstile_token: string;
};

export type RegisterUserResponse = {
	id: number;
	email: string;
	access_token: string;
	refresh_token: string;
};

export type RefreshAccessTokenRequest = {
	refresh_token: string;
};

export type RefreshAccessTokenResponse = {
	access_token: string;
};
