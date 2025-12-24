import { registerAuthRoutes } from './auth/urls';
import { registerTransactionsRoutes } from './transactions/urls';
import { RegisterAppRoutes } from './types';

export const registerAppRoutes: RegisterAppRoutes = (router, urlPrefix = null) => {
	registerAuthRoutes(router, urlPrefix);
	registerTransactionsRoutes(router, urlPrefix);
};
