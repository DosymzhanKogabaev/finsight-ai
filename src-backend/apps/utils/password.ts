import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
	return await bcrypt.compare(password, hashed);
}
