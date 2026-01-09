import { registerAuthRoutes } from './auth/urls';
import { registerCategoriesRoutes } from './categories/urls';
import { registerTransactionsRoutes } from './transactions/urls';
import { RegisterAppRoutes } from './types';

export const registerAppRoutes: RegisterAppRoutes = (router, urlPrefix = null) => {
	registerAuthRoutes(router, urlPrefix);
	registerCategoriesRoutes(router, urlPrefix);
	registerTransactionsRoutes(router, urlPrefix);
};
