import { RegisterUserRequest, RegisterUserResponse } from '@/shared';
import { createUser, getUserByEmail } from '@/src-backend/apps/auth/api/services/user';
import { handleError } from '@/src-backend/apps/common';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';
import { UserAlreadyExistsException } from '../../exceptions/user';

const REQUEST_BODY_SCHEMA = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	full_name: z.string().min(1),
}) satisfies z.ZodType<RegisterUserRequest>;

const RESPONSE_SCHEMA = z.object({
	id: z.number(),
	email: z.string().email(),
}) satisfies z.ZodType<RegisterUserResponse>;

export class PublicRegisterAPI extends OpenAPIRoute {
	schema = {
		request: { body: { content: { 'application/json': { schema: REQUEST_BODY_SCHEMA } } } },
		responses: { '200': { content: { 'application/json': { schema: RESPONSE_SCHEMA } } } },
	} as any;

	async handle(_request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const userData = { ...(data.body as RegisterUserRequest) };
			let user = await getUserByEmail(env, userData.email);
			if (user) {
				throw new UserAlreadyExistsException('User already exists');
			}
			const newUser = await createUser(env, userData);
			return {
				id: newUser.id,
				email: newUser.email,
			};
		} catch (error) {
			console.error('Register API error:', error);
			return handleError(error);
		}
	}
}
