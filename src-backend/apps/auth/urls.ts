import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import { PrivateMeAPI, PrivateUploadAvatarAPI, PublicLoginAPI, PublicRefreshAPI, PublicRegisterAPI } from './api/endpoints';

export const registerAuthRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	// Public routes
	router.post(`${urlPrefix}/public/auth/register`, PublicRegisterAPI);
	router.post(`${urlPrefix}/public/auth/login`, PublicLoginAPI);
	router.post(`${urlPrefix}/public/auth/refresh`, PublicRefreshAPI);

	// Private routes (require authentication)
	// Note: authMiddleware is applied automatically for /private/* routes in the middleware
	router.get(`${urlPrefix}/private/auth/me`, PrivateMeAPI);
	router.post(`${urlPrefix}/private/auth/upload-avatar`, PrivateUploadAvatarAPI);
};
