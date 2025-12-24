import { ServiceException } from '@/src-backend/apps/common';

export class CategoryNotFoundException extends ServiceException {
	constructor(message: string = 'Category not found or not accessible') {
		super(message, 404);
		this.name = 'CategoryNotFoundException';
	}
}
