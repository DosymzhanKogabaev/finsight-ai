import { RegisterUserRequest, User } from '@/shared';
import { hashPassword } from '@/src-backend/apps/utils/password';
import { initDbConnect } from '@/src-backend/db';
import { userSchema } from '@/src-backend/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserByEmail(env: Env, email: string): Promise<User> {
	const db = initDbConnect(env);
	const [user] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);
	return user;
}

export async function getUserById(env: Env, userId: number): Promise<User> {
	const db = initDbConnect(env);
	const [user] = await db.select().from(userSchema).where(eq(userSchema.id, userId)).limit(1);
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
