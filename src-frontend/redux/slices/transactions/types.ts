import { TransactionResponse } from '@/shared';
import { FetchInfo } from '../../types';

export interface TransactionsState {
	transactions: TransactionResponse[];
	nextCursor: string | null;
	getTransactionsInfo: FetchInfo;
	getTransactionInfo: FetchInfo;
	createTransactionInfo: FetchInfo;
	updateTransactionInfo: FetchInfo;
	deleteTransactionInfo: FetchInfo;
}
