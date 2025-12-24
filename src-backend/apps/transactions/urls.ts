import { RouterOpenApiType } from '@/src-backend/types';
import { RegisterAppRoutes } from '../types';
import { PrivateCreateTransactionAPI, PrivateDeleteTransactionAPI, PrivateUpdateTransactionAPI } from './api/endpoints';

export const registerTransactionsRoutes: RegisterAppRoutes = (router: RouterOpenApiType, urlPrefix = null) => {
	router.post(`${urlPrefix}/transactions/private`, PrivateCreateTransactionAPI);
	router.put(`${urlPrefix}/transactions/private/:id`, PrivateUpdateTransactionAPI);
	router.delete(`${urlPrefix}/transactions/private/:id`, PrivateDeleteTransactionAPI);
};
