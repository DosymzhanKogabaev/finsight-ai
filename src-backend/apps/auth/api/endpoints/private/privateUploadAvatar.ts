import { UploadAvatarResponse } from '@/shared';
import { BadRequestException, UnauthorizedException } from '@/src-backend/apps/common';
import { handleError } from '@/src-backend/apps/common/handleError';
import { OpenAPIRoute } from 'chanfana';
import { IRequest } from 'itty-router';
import { z } from 'zod';
import { updateUserAvatar } from '../../services/user';

const RESPONSE_SCHEMA = z.object({
	success: z.boolean(),
	avatar_url: z.string(),
}) satisfies z.ZodType<UploadAvatarResponse>;

export class PrivateUploadAvatarAPI extends OpenAPIRoute {
	schema = {
		requestBody: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						properties: {
							file: {
								type: 'string',
								format: 'binary',
								description: 'Avatar image file (max 5MB, supported formats: PNG, JPG, JPEG, WebP)',
							},
						},
						required: ['file'],
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Avatar uploaded successfully',
				content: { 'application/json': { schema: RESPONSE_SCHEMA } },
			},
		},
		security: [{ BearerAuth: [] }],
	} as any;

	async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
		try {
			const userId = request.user?.user_id;
			if (!userId) {
				throw new UnauthorizedException('User not authenticated');
			}

			const contentType = request.headers.get('content-type') || '';
			if (!contentType.startsWith('multipart/form-data')) {
				throw new BadRequestException('Expected multipart/form-data content type');
			}

			const form = await request.formData();
			const file = form.get('file') as File | null;
			if (!file) {
				throw new BadRequestException('No file provided');
			}

			// 5MB
			if (file.size > 5 * 1024 * 1024) {
				throw new BadRequestException('File size exceeds 5MB');
			}

			// Validate file type
			const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				throw new BadRequestException('Invalid file type');
			}

			const ext = file.type.split('/')[1];
			const key = `${userId}/avatar.${ext}`;

			await env.R2_BUCKET.put(key, file.stream(), {
				httpMetadata: {
					contentType: file.type,
				},
			});

			await updateUserAvatar(env, userId, key);

			const response = {
				success: true,
				avatar_url: key,
			};
			return Response.json(response);
		} catch (error) {
			console.error('Upload avatar API error:', error);
			return handleError(error);
		}
	}
}
