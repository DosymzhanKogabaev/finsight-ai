import { CategoryResponse } from '@/shared';
import { FetchInfo } from '../../types';

export interface CategoriesState {
	categories: CategoryResponse[];
	getCategoriesInfo: FetchInfo;
	getCategoryInfo: FetchInfo;
	createCategoryInfo: FetchInfo;
	updateCategoryInfo: FetchInfo;
	deleteCategoryInfo: FetchInfo;
}
