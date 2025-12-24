import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import { PrivateCreateTransactionAPI } from './api/endpoints';

export const registerTransactionsRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	router.post(`${urlPrefix}/transactions/private`, PrivateCreateTransactionAPI);
};
