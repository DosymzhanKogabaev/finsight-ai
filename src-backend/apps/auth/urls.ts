import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import { PublicRegisterAPI } from './api/public';

export const registerAuthRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	// Public routes
	router.post(`${urlPrefix}/public/auth/register`, PublicRegisterAPI);
};
