import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import { PublicLoginAPI, PublicRefreshAPI, PublicRegisterAPI } from './api/public';

export const registerAuthRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	// Public routes
	router.post(`${urlPrefix}/public/auth/register`, PublicRegisterAPI);
	router.post(`${urlPrefix}/public/auth/login`, PublicLoginAPI);
	router.post(`${urlPrefix}/public/auth/refresh`, PublicRefreshAPI);

	// Private routes (require authentication)
};
