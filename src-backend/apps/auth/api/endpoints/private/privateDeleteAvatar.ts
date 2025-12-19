import { UnauthorizedException } from '@/src-backend/apps/common/exceptions';
import { handleError } from '@/src-backend/apps/common/handleError';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { deleteUserAvatar } from '../../services/user';

export class PrivateDeleteAvatarAPI extends OpenAPIRoute {
	schema = {
		responses: {
			'200': {
				description: 'Avatar deleted successfully',
			},
		},
		security: [{ BearerAuth: [] }],
	} as any;
	async handle(request: IRequest, env: Env, ctx: ExecutionContext) {
		try {
			const userId = request.user?.user_id;
			if (!userId) {
				throw new UnauthorizedException('User not authenticated');
			}
			ctx.waitUntil(deleteUserAvatar(env, userId));
			return Response.json({
				success: true,
			});
		} catch (error) {
			console.error('Delete avatar API error:', error);
			return handleError(error);
		}
	}
}
