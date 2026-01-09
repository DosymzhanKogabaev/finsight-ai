import { categoriesSchema } from '@/src-backend/db/schema/categories';

export type Category = typeof categoriesSchema.$inferSelect;

export type CategoryInfo = {
	id: number;
	type: 'income' | 'expense';
	name: string;
	icon: string | null;
	color: string | null;
};

export type CreateCategoryRequest = {
	type: 'income' | 'expense';
	name: string;
	icon?: string | null;
	color?: string | null;
	sort_order?: number;
};

export type UpdateCategoryRequest = {
	type?: 'income' | 'expense';
	name?: string;
	icon?: string | null;
	color?: string | null;
	sort_order?: number;
};

export type CategoryResponse = Omit<Category, 'deleted_at'>;
