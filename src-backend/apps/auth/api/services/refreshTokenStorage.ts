import { DeviceInfo } from '@/shared';

/**
 * Generate KV key for refresh token storage
 * Format: user_id:jti
 */
export function getRefreshTokenKey(userId: number, jti: string): string {
	return `${userId}:${jti}`;
}

/**
 * Store refresh token info in KV
 */
export async function storeRefreshToken(
	env: Env,
	userId: number,
	jti: string,
	deviceInfo: { ip: string; ua: string; device: string },
	createdAt: number,
	expiresAt: number
): Promise<void> {
	const key = getRefreshTokenKey(userId, jti);
	const value: DeviceInfo = {
		...deviceInfo,
		createdAt,
		expiresAt,
	};

	// Store in KV with expiration (KV automatically expires the key)
	// TTL is in seconds, calculate from now to expiresAt
	const ttl = expiresAt - Math.floor(Date.now() / 1000);
	if (ttl > 0) {
		await env.REFRESH_TOKENS_KV.put(key, JSON.stringify(value), {
			expirationTtl: ttl,
		});
	}
}

/**
 * Get refresh token info from KV
 */
export async function getRefreshTokenInfo(env: Env, userId: number, jti: string): Promise<DeviceInfo | null> {
	const key = getRefreshTokenKey(userId, jti);
	const value = await env.REFRESH_TOKENS_KV.get(key);

	if (!value) {
		return null;
	}

	return JSON.parse(value) as DeviceInfo;
}

/**
 * Delete a specific refresh token from KV
 */
export async function deleteRefreshToken(env: Env, userId: number, jti: string): Promise<void> {
	const key = getRefreshTokenKey(userId, jti);
	await env.REFRESH_TOKENS_KV.delete(key);
}

/**
 * Delete all refresh tokens for a user
 */
export async function deleteAllUserRefreshTokens(env: Env, userId: number): Promise<void> {
	// List all keys with prefix user_id:
	const prefix = `${userId}:`;
	const keys = await env.REFRESH_TOKENS_KV.list({ prefix });

	// Delete all keys
	const deletePromises = keys.keys.map((key) => env.REFRESH_TOKENS_KV.delete(key.name));
	await Promise.all(deletePromises);
}

/**
 * Get all refresh tokens (devices) for a user
 */
export async function getAllUserRefreshTokens(env: Env, userId: number): Promise<DeviceInfo[]> {
	const prefix = `${userId}:`;
	const keys = await env.REFRESH_TOKENS_KV.list({ prefix });

	// Get all values
	const values = await Promise.all(
		keys.keys.map(async (key) => {
			const value = await env.REFRESH_TOKENS_KV.get(key.name);
			return value ? (JSON.parse(value) as DeviceInfo) : null;
		})
	);

	// Filter out null values and expired tokens
	const now = Math.floor(Date.now() / 1000);
	return values.filter((v): v is DeviceInfo => v !== null && v.expiresAt > now);
}
