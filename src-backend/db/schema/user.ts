import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userSchema = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	email: text('email').notNull().unique(),
	email_verified: integer('email_verified').notNull().default(0),
	password_hash: text('password_hash').notNull(),
	full_name: text('full_name').notNull(),
	locale: text('locale').notNull().default('ru-RU'),
	currency: text('currency').notNull().default('KZT'),
	avatar_url: text('avatar_url').default(sql`NULL`),
	subscription_plan: text('subscription_plan').notNull().default('free'),
	subscription_status: text('subscription_status').notNull().default('active'),
	subscription_renew_at: integer('subscription_renew_at').default(sql`NULL`),
	ai_usage_tokens: integer('ai_usage_tokens').notNull().default(0),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	deleted_at: integer('deleted_at').default(sql`NULL`),
});
