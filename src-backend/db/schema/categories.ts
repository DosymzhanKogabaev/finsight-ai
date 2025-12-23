import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categoriesSchema = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	// null = default category
	user_id: integer('user_id'),

	type: text('type', {
		enum: ['income', 'expense'],
	}).notNull(),

	name: text('name').notNull(),

	// UI helpers
	icon: text('icon'),
	color: text('color'),

	sort_order: integer('sort_order').notNull().default(0),

	created_at: integer('created_at')
		.notNull()
		.default(sql`(unixepoch())`),

	updated_at: integer('updated_at')
		.notNull()
		.default(sql`(unixepoch())`),

	deleted_at: integer('deleted_at'),
});
