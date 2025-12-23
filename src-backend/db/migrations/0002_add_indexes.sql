-- Indexes for better query performance
-- Transactions table indexes
CREATE INDEX IF NOT EXISTS `idx_categories_user` ON `categories` (`user_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_categories_type` ON `categories` (`type`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_transactions_user` ON `transactions` (`user_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_transactions_user_date` ON `transactions` (`user_id`, `occurred_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_transactions_category` ON `transactions` (`category_id`);