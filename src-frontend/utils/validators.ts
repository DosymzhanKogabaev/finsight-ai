/**
 * Frontend validation utilities matching backend Zod schemas
 */

export interface ValidationError {
	field: string;
	message: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string, t: (key: string) => string): string | null => {
	if (!email || email.trim() === '') {
		return t('auth.emailRequired');
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return t('auth.invalidEmail');
	}

	return null;
};

/**
 * Validate password for login (min 1 character)
 */
export const validateLoginPassword = (password: string, t: (key: string) => string): string | null => {
	if (!password || password.length === 0) {
		return t('auth.passwordRequired');
	}

	return null;
};

/**
 * Validate password for registration (min 8 characters)
 */
export const validateRegisterPassword = (password: string, t: (key: string) => string): string | null => {
	if (!password || password.length === 0) {
		return t('auth.passwordRequired');
	}

	if (password.length < 8) {
		return t('auth.passwordMin');
	}

	return null;
};

/**
 * Validate full name (min 1 character)
 */
export const validateFullName = (fullName: string, t: (key: string) => string): string | null => {
	if (!fullName || fullName.trim() === '') {
		return t('validation.required');
	}

	return null;
};

/**
 * Validate login form
 */
export const validateLoginForm = (
	email: string,
	password: string,
	t: (key: string) => string
): { isValid: boolean; errors: { email?: string; password?: string } } => {
	const errors: { email?: string; password?: string } = {};

	const emailError = validateEmail(email, t);
	if (emailError) errors.email = emailError;

	const passwordError = validateLoginPassword(password, t);
	if (passwordError) errors.password = passwordError;

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

/**
 * Validate register form
 */
export const validateRegisterForm = (
	fullName: string,
	email: string,
	password: string,
	t: (key: string) => string
): { isValid: boolean; errors: { fullName?: string; email?: string; password?: string } } => {
	const errors: { fullName?: string; email?: string; password?: string } = {};

	const fullNameError = validateFullName(fullName, t);
	if (fullNameError) errors.fullName = fullNameError;

	const emailError = validateEmail(email, t);
	if (emailError) errors.email = emailError;

	const passwordError = validateRegisterPassword(password, t);
	if (passwordError) errors.password = passwordError;

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};
