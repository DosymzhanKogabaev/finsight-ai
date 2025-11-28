CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text NOT NULL,
	`locale` text DEFAULT 'ru-RU' NOT NULL,
	`currency` text DEFAULT 'KZT' NOT NULL,
	`avatar_url` text DEFAULT NULL,
	`subscription_plan` text DEFAULT 'free' NOT NULL,
	`subscription_status` text DEFAULT 'active' NOT NULL,
	`subscription_renew_at` integer DEFAULT NULL,
	`ai_usage_tokens` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer DEFAULT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);