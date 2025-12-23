import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userSchema } from './user';
import { categoriesSchema } from './categories';

export const transactionsSchema = sqliteTable('transactions', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	user_id: integer('user_id')
		.notNull()
		.references(() => userSchema.id, { onDelete: 'cascade' }),

	category_id: integer('category_id')
		.notNull()
		.references(() => categoriesSchema.id),

	type: text('type', {
		enum: ['income', 'expense'],
	}).notNull(),

	amount: integer('amount').notNull(),

	currency: text('currency').notNull().default('KZT'),

	description: text('description'),

	occurred_at: integer('occurred_at').notNull(),

	created_at: integer('created_at')
		.notNull()
		.default(sql`(unixepoch())`),

	updated_at: integer('updated_at')
		.notNull()
		.default(sql`(unixepoch())`),

	deleted_at: integer('deleted_at'),
});
