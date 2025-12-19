import { userSchema } from '@/src-backend/db/schema';

export type User = typeof userSchema.$inferSelect;

export type UserMeResponse = Omit<User, 'password_hash' | 'deleted_at' | 'email_verified'>;

export type UploadAvatarResponse = {
	success: boolean;
	avatar_url: string;
};
