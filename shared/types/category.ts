import { categoriesSchema } from '@/src-backend/db/schema/categories';

export type Category = typeof categoriesSchema.$inferSelect;

export type CategoryInfo = {
	id: number;
	type: 'income' | 'expense';
	name: string;
	icon: string | null;
	color: string | null;
};
