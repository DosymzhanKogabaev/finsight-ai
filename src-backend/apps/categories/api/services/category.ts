import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/shared';
import { CategoryNotFoundException } from '@/src-backend/apps/categories/exceptions/category';
import { BadRequestException } from '@/src-backend/apps/common';
import { initDbConnect } from '@/src-backend/db';

export async function createCategory(env: Env, userId: number, categoryData: CreateCategoryRequest): Promise<Category> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	const icon = categoryData.icon || null;
	const color = categoryData.color || null;
	const sortOrder = categoryData.sort_order ?? 0;

	const result = await d1Client
		.prepare(
			`
			INSERT INTO categories (
				user_id,
				type,
				name,
				icon,
				color,
				sort_order,
				created_at,
				updated_at
			)
			VALUES (?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
			RETURNING 
				id,
				user_id,
				type,
				name,
				icon,
				color,
				sort_order,
				created_at,
				updated_at,
				deleted_at
		`
		)
		.bind(userId, categoryData.type, categoryData.name, icon, color, sortOrder)
		.first<Category>();

	if (!result) {
		throw new CategoryNotFoundException('Failed to create category');
	}

	return result;
}

export async function getCategoryById(env: Env, userId: number, categoryId: number): Promise<Category> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Users can access their own categories or default categories (user_id IS NULL)
	const result = await d1Client
		.prepare(
			`
			SELECT 
				id,
				user_id,
				type,
				name,
				icon,
				color,
				sort_order,
				created_at,
				updated_at,
				deleted_at
			FROM categories
			WHERE id = ? 
			AND (user_id = ? OR user_id IS NULL)
			AND deleted_at IS NULL
		`
		)
		.bind(categoryId, userId)
		.first<Category>();

	if (!result) {
		throw new CategoryNotFoundException('Category not found or not accessible');
	}

	return result;
}

export async function getCategories(env: Env, userId: number, type?: 'income' | 'expense'): Promise<Category[]> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Users can access their own categories or default categories (user_id IS NULL)
	let query = `
		SELECT 
			id,
			user_id,
			type,
			name,
			icon,
			color,
			sort_order,
			created_at,
			updated_at,
			deleted_at
		FROM categories
		WHERE (user_id = ? OR user_id IS NULL)
		AND deleted_at IS NULL
	`;

	const values: any[] = [userId];

	if (type) {
		query += ' AND type = ?';
		values.push(type);
	}

	query += ' ORDER BY sort_order ASC, created_at ASC';

	const results = await d1Client
		.prepare(query)
		.bind(...values)
		.all<Category>();

	return results.results || [];
}

export async function updateCategory(env: Env, userId: number, categoryId: number, updateData: UpdateCategoryRequest): Promise<Category> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Build SET clause and collect values
	const updates: string[] = [];
	const values: any[] = [];

	if (updateData.type !== undefined) {
		updates.push('type = ?');
		values.push(updateData.type);
	}

	if (updateData.name !== undefined) {
		updates.push('name = ?');
		values.push(updateData.name);
	}

	if (updateData.icon !== undefined) {
		updates.push('icon = ?');
		values.push(updateData.icon || null);
	}

	if (updateData.color !== undefined) {
		updates.push('color = ?');
		values.push(updateData.color || null);
	}

	if (updateData.sort_order !== undefined) {
		updates.push('sort_order = ?');
		values.push(updateData.sort_order);
	}

	// If no fields to update, throw error
	if (updates.length === 0) {
		throw new BadRequestException('No fields to update');
	}

	// Add updated_at
	updates.push('updated_at = unixepoch()');

	// Build WHERE clause: category must exist, belong to user (not default), not be deleted
	// Note: Default categories (user_id IS NULL) cannot be updated
	const whereConditions = ['id = ?', 'user_id = ?', 'deleted_at IS NULL'];
	values.push(categoryId, userId);

	// Execute single UPDATE query
	const updateQuery = `
		UPDATE categories
		SET ${updates.join(', ')}
		WHERE ${whereConditions.join(' AND ')}
		RETURNING 
			id,
			user_id,
			type,
			name,
			icon,
			color,
			sort_order,
			created_at,
			updated_at,
			deleted_at
	`;

	const result = await d1Client
		.prepare(updateQuery)
		.bind(...values)
		.first<Category>();

	if (!result) {
		// Check if category exists to provide better error message
		const categoryCheck = await d1Client
			.prepare('SELECT id, user_id, deleted_at FROM categories WHERE id = ?')
			.bind(categoryId)
			.first<{ id: number; user_id: number | null; deleted_at: number | null }>();

		if (!categoryCheck) {
			throw new CategoryNotFoundException('Category not found');
		}

		if (categoryCheck.deleted_at !== null) {
			throw new CategoryNotFoundException('Category is deleted');
		}

		if (categoryCheck.user_id === null) {
			throw new CategoryNotFoundException('Default categories cannot be updated');
		}

		if (categoryCheck.user_id !== userId) {
			throw new CategoryNotFoundException('Category belongs to another user');
		}

		throw new CategoryNotFoundException('Category not found or not accessible');
	}

	return result;
}

export async function deleteCategory(env: Env, userId: number, categoryId: number): Promise<void> {
	const db = initDbConnect(env);
	const d1Client = db.$client;

	// Soft delete: set deleted_at timestamp
	// Note: Default categories (user_id IS NULL) cannot be deleted
	const result = await d1Client
		.prepare(
			`
			UPDATE categories
			SET deleted_at = unixepoch()
			WHERE id = ? AND user_id = ? AND deleted_at IS NULL
			RETURNING id
		`
		)
		.bind(categoryId, userId)
		.first<{ id: number }>();

	if (!result) {
		// Check if category exists to provide better error message
		const categoryCheck = await d1Client
			.prepare('SELECT id, user_id, deleted_at FROM categories WHERE id = ?')
			.bind(categoryId)
			.first<{ id: number; user_id: number | null; deleted_at: number | null }>();

		if (!categoryCheck) {
			throw new CategoryNotFoundException('Category not found');
		}

		if (categoryCheck.deleted_at !== null) {
			throw new CategoryNotFoundException('Category is already deleted');
		}

		if (categoryCheck.user_id === null) {
			throw new CategoryNotFoundException('Default categories cannot be deleted');
		}

		if (categoryCheck.user_id !== userId) {
			throw new CategoryNotFoundException('Category belongs to another user');
		}

		throw new CategoryNotFoundException('Category not found or not accessible');
	}
}
