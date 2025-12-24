import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import {
	PrivateDeleteAvatarAPI,
	PrivateMeAPI,
	PrivateUploadAvatarAPI,
	PublicLoginAPI,
	PublicRefreshAPI,
	PublicRegisterAPI,
} from './api/endpoints';

export const registerAuthRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	// Public routes
	router.post(`${urlPrefix}/auth/public/register`, PublicRegisterAPI);
	router.post(`${urlPrefix}/auth/public/login`, PublicLoginAPI);
	router.post(`${urlPrefix}/auth/public/refresh`, PublicRefreshAPI);

	// Private routes (require authentication)
	// Note: authMiddleware is applied automatically for /private/* routes in the middleware
	router.get(`${urlPrefix}/auth/private/me`, PrivateMeAPI);
	router.post(`${urlPrefix}/auth/private/upload-avatar`, PrivateUploadAvatarAPI);
	router.delete(`${urlPrefix}/auth/private/delete-avatar`, PrivateDeleteAvatarAPI);
};
