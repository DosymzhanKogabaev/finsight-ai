import { RegisterUserRequest, RegisterUserResponse } from '@/shared';
import { generateTokens } from '@/src-backend/apps/auth/api/services/jwt';
import { createUser, getUserByEmail } from '@/src-backend/apps/auth/api/services/user';
import { extractDeviceInfo } from '@/src-backend/apps/auth/utils/device';
import { handleError } from '@/src-backend/apps/common';
import { OpenAPIRouteWithTurnstile } from '@/src-backend/middlewares';
import { IRequest } from 'itty-router';
import { z } from 'zod';
import { UserAlreadyExistsException } from '../../../exceptions/user';

const REQUEST_BODY_SCHEMA = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	full_name: z.string().min(1),
	turnstile_token: z.string().describe('Turnstile token from client'),
}) satisfies z.ZodType<RegisterUserRequest>;

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	email: z.string().email(),
	access_token: z.string(),
	refresh_token: z.string(),
}) satisfies z.ZodType<RegisterUserResponse>;

export class PublicRegisterAPI extends OpenAPIRouteWithTurnstile {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: {
			'200': {
				description: 'User successfully registered',
				content: { 'application/json': { schema: RESPONSE_SCHEMA } },
			},
		},
	} as any;

	async handleAfterTurnstile(request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const { turnstile_token, ...userRequest } = data.body;
			const userData = { ...userRequest };

			let user = await getUserByEmail(env, userData.email);
			if (user) {
				throw new UserAlreadyExistsException('User already exists');
			}

			// Turnstile token is verified by middleware before reaching here
			const newUser = await createUser(env, userData);

			// Extract device info and generate tokens
			const deviceInfo = extractDeviceInfo(request);
			const tokens = await generateTokens(env, newUser, deviceInfo);

			const response = {
				id: newUser.id,
				email: newUser.email,
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
			};
			return Response.json(response);
		} catch (error) {
			console.error('Register API error:', error);
			return handleError(error);
		}
	}
}
