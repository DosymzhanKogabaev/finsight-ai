import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import {
	PrivateCreateCategoryAPI,
	PrivateDeleteCategoryAPI,
	PrivateGetCategoriesAPI,
	PrivateGetCategoryAPI,
	PrivateUpdateCategoryAPI,
} from './api/endpoints';

export const registerCategoriesRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	router.get(`${urlPrefix}/categories/private`, PrivateGetCategoriesAPI);
	router.get(`${urlPrefix}/categories/private/:id`, PrivateGetCategoryAPI);
	router.post(`${urlPrefix}/categories/private`, PrivateCreateCategoryAPI);
	router.put(`${urlPrefix}/categories/private/:id`, PrivateUpdateCategoryAPI);
	router.delete(`${urlPrefix}/categories/private/:id`, PrivateDeleteCategoryAPI);
};
