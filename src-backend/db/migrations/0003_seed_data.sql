-- Seed data migration
-- This file contains initial data to populate the database
-- Idempotent seed migration

-- Example: Default categories for all users (user_id = NULL means default)
-- You can customize these based on your needs

-- Income categories
-- Only insert if no default income categories exist yet
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'income', 'Salary', 'work', '#16A34A', 1, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'income' AND `name` = 'Salary');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'income', 'Freelance', 'code', '#16A34A', 2, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'income' AND `name` = 'Freelance');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'income', 'Investment', 'trending_up', '#16A34A', 3, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'income' AND `name` = 'Investment');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'income', 'Gift', 'card_giftcard', '#16A34A', 4, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'income' AND `name` = 'Gift');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'income', 'Other', 'more_horiz', '#16A34A', 5, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'income' AND `name` = 'Other');
--> statement-breakpoint

-- Expense categories
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Food & Dining', 'restaurant', '#EF4444', 1, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Food & Dining');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Transportation', 'directions_car', '#EF4444', 2, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Transportation');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Shopping', 'shopping_bag', '#EF4444', 3, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Shopping');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Bills & Utilities', 'receipt', '#EF4444', 4, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Bills & Utilities');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Entertainment', 'movie', '#EF4444', 5, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Entertainment');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Healthcare', 'local_hospital', '#EF4444', 6, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Healthcare');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Education', 'school', '#EF4444', 7, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Education');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Travel', 'flight', '#EF4444', 8, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Travel');
--> statement-breakpoint
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `sort_order`, `created_at`, `updated_at`)
SELECT NULL, 'expense', 'Other', 'more_horiz', '#EF4444', 9, unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `user_id` IS NULL AND `type` = 'expense' AND `name` = 'Other');