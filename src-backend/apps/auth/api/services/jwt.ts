import { JwtPayload, JwtTokens, User } from '@/shared';
import {
	InvalidOrExpiredTokenException,
	InvalidTokenPayloadException,
	NotCorrectTokenTypeException,
} from '@/src-backend/apps/auth/exceptions/jwt';
import jwt from '@tsndr/cloudflare-worker-jwt';

export async function generateTokens(env: Env, user: User): Promise<JwtTokens> {
	const SECRET_TOKEN = env.JWT_SECRET_TOKEN;
	if (!SECRET_TOKEN || typeof SECRET_TOKEN !== 'string') {
		throw new Error(
			'JWT_SECRET_TOKEN is not configured. Please set it in .dev.vars for local development or in wrangler.jsonc vars for production.'
		);
	}
	const currentTimestamp = Math.floor(Date.now() / 1000);
	const accessTokenExpiresIn = Number(env.ACCESS_TOKEN_EXPIRES_IN);
	const refreshTokenExpiresIn = Number(env.REFRESH_TOKEN_EXPIRES_IN);
	const accessExpiresIn = currentTimestamp + accessTokenExpiresIn;
	const refreshExpiresIn = currentTimestamp + refreshTokenExpiresIn;
	const payload = {
		user_id: user.id,
	};
	const accessPayload: JwtPayload = {
		...payload,
		token_type: 'access',
		jti: crypto.randomUUID(),
		exp: accessExpiresIn,
	};
	const refreshPayload: JwtPayload = {
		...payload,
		token_type: 'refresh',
		jti: crypto.randomUUID(),
		exp: refreshExpiresIn,
	};
	const accessToken = await jwt.sign(accessPayload, SECRET_TOKEN);

	const refreshToken = await jwt.sign(refreshPayload, SECRET_TOKEN);

	return { access_token: accessToken, refresh_token: refreshToken };
}

export async function refreshAccessToken(env: Env, refreshToken: string) {
	const SECRET_TOKEN = env.JWT_SECRET_TOKEN;
	if (!SECRET_TOKEN || typeof SECRET_TOKEN !== 'string') {
		throw new Error(
			'JWT_SECRET_TOKEN is not configured. Please set it in .dev.vars for local development or in wrangler.jsonc vars for production.'
		);
	}
	const currentTimestamp = Math.floor(Date.now() / 1000);
	const accessTokenExpiresIn = Number(env.ACCESS_TOKEN_EXPIRES_IN);
	const accessExpiresIn = currentTimestamp + accessTokenExpiresIn;
	const isValid = await jwt.verify(refreshToken, SECRET_TOKEN);
	if (!isValid) {
		throw new InvalidOrExpiredTokenException();
	}

	const decoded = jwt.decode(refreshToken);
	const payload = decoded?.payload as JwtPayload;
	if (!payload.token_type || payload.token_type !== 'refresh') {
		throw new NotCorrectTokenTypeException();
	}
	if (!payload?.user_id || !payload?.exp) {
		throw new InvalidTokenPayloadException();
	}

	const newAccessToken = await jwt.sign(
		{
			...payload,
			token_type: 'access',
			jti: crypto.randomUUID(),
			exp: accessExpiresIn,
		},
		SECRET_TOKEN
	);

	return newAccessToken;
}
