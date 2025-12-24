import { ServiceException } from '@/src-backend/apps/common';

export class CategoryNotFoundException extends ServiceException {
	constructor(message: string = 'Category not found or not accessible') {
		super(message, 404);
		this.name = 'CategoryNotFoundException';
	}
}

export class TransactionNotFoundException extends ServiceException {
	constructor(message: string = 'Transaction not found or not accessible') {
		super(message, 404);
		this.name = 'TransactionNotFoundException';
	}
}
