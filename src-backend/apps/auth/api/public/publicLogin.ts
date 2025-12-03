import { LoginUserRequest, LoginUserResponse } from '@/shared';
import { generateTokens } from '@/src-backend/apps/auth/api/services/jwt';
import { getUserByEmail } from '@/src-backend/apps/auth/api/services/user';
import { extractDeviceInfo } from '@/src-backend/apps/auth/utils/device';
import { handleError } from '@/src-backend/apps/common';
import { verifyPassword } from '@/src-backend/apps/utils/password';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';
import { InvalidCredentialsException } from '../../exceptions/user';

const REQUEST_BODY_SCHEMA = z.object({
	email: z.string().email(),
	password: z.string().min(1),
}) satisfies z.ZodType<LoginUserRequest>;

const RESPONSE_SCHEMA = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
}) satisfies z.ZodType<LoginUserResponse>;

export class PublicLoginAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: {
			'200': {
				description: 'User successfully logged in',
				content: { 'application/json': { schema: RESPONSE_SCHEMA } },
			},
		},
	} as any;

	async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const loginData = { ...(data.body as LoginUserRequest) };

			// Get user by email
			const user = await getUserByEmail(env, loginData.email);
			if (!user) {
				throw new InvalidCredentialsException('User with this email does not exist');
			}

			// Verify password
			const isPasswordValid = await verifyPassword(loginData.password, user.password_hash);
			if (!isPasswordValid) {
				throw new InvalidCredentialsException('Invalid password');
			}

			// Extract device info
			const deviceInfo = extractDeviceInfo(request);

			// Generate tokens and store refresh token in KV
			const tokens = await generateTokens(env, user, deviceInfo);

			return {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
			};
		} catch (error) {
			console.error('Login API error:', error);
			return handleError(error);
		}
	}
}
