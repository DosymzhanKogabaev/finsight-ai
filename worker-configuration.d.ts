interface Env {
	// Secrets
	TURNSTILE_SECRET_KEY: string;
	JWT_SECRET_TOKEN: string;

	// Variables
	ACCESS_TOKEN_EXPIRES_IN: number;
	REFRESH_TOKEN_EXPIRES_IN: number;

	// Bindings
	DB_D1: D1Database;
	ASSETS: Fetcher;
	REFRESH_TOKENS_KV: KVNamespace;
}
