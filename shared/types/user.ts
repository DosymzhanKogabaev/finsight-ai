import { userSchema } from '@/src-backend/db/schema';

export type User = typeof userSchema.$inferSelect;
