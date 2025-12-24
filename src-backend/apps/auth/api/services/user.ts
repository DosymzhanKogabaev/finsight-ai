import { RegisterUserRequest, User } from '@/shared';
import { hashPassword } from '@/src-backend/apps/utils/password';
import { initDbConnect } from '@/src-backend/db';
import { userSchema } from '@/src-backend/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export async function getUserByEmail(env: Env, email: string): Promise<User> {
	const db = initDbConnect(env);
	const [user] = await db
		.select()
		.from(userSchema)
		.where(and(eq(userSchema.email, email), isNull(userSchema.deleted_at)))
		.limit(1);
	return user;
}

export async function getUserById(env: Env, userId: number): Promise<User> {
	const db = initDbConnect(env);
	const [user] = await db
		.select()
		.from(userSchema)
		.where(and(eq(userSchema.id, userId), isNull(userSchema.deleted_at)))
		.limit(1);
	return user;
}

export async function createUser(env: Env, user: RegisterUserRequest): Promise<User> {
	const db = initDbConnect(env);
	const passwordHash = await hashPassword(user.password);
	const [newUser] = await db
		.insert(userSchema)
		.values({
			email: user.email,
			password_hash: passwordHash,
			full_name: user.full_name,
		})
		.returning();
	return newUser;
}

export async function updateUserAvatar(env: Env, userId: number, avatarUrl: string): Promise<void> {
	const db = initDbConnect(env);
	await db.update(userSchema).set({ avatar_url: avatarUrl }).where(eq(userSchema.id, userId));
}

export async function deleteUserAvatar(env: Env, userId: number): Promise<void> {
	const db = initDbConnect(env);

	// Note: We need 2 queries here because SQLite/D1 doesn't support returning OLD values
	// Get the current avatar URL before updating (1st query)
	const [user] = await db.select({ avatar_url: userSchema.avatar_url }).from(userSchema).where(eq(userSchema.id, userId)).limit(1);

	// Update to remove avatar URL (2nd query)
	await db.update(userSchema).set({ avatar_url: null }).where(eq(userSchema.id, userId));

	// Delete the old avatar from R2 if it exists
	if (user?.avatar_url) {
		console.log('Deleting avatar from R2:', user.avatar_url);
		await env.R2_BUCKET.delete(user.avatar_url);
	}
}
