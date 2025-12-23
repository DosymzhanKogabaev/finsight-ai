import { ErrorStatusCode } from '../api/apiClient';
import i18n from '../i18n/config';

/**
 * List of known backend exception names
 */
const KNOWN_EXCEPTIONS = [
	'ServiceException',
	'BadRequestException',
	'UnauthorizedException',
	'UserAlreadyExistException',
	'InvalidCredentialsException',
	'UserNotFoundException',
	'TurnstileVerificationFailedException',
	'InvalidOrExpiredTokenException',
	'NotCorrectTokenTypeException',
	'InvalidTokenPayloadException',
];

/**
 * Get user-friendly error message from backend error
 * Maps backend exception names to i18n keys
 */
export const getErrorMessage = (error: any): string => {
	// Extract exception name from error (works for both ErrorStatusCode and regular Error)
	const exceptionName = error?.name || error?.error;

	// Check if we have a translation for this exception
	if (exceptionName && KNOWN_EXCEPTIONS.includes(exceptionName)) {
		const translationKey = `error.${exceptionName}`;

		// Force i18n to use current language
		if (i18n.exists(translationKey)) {
			return i18n.t(translationKey);
		}
	}

	// Handle network errors
	if (error instanceof TypeError && error.message === 'Load failed') {
		return i18n.t('error.network');
	}

	// Default fallback (never use backend's English message)
	return i18n.t('error.generic');
};

/**
 * Check if error is an authentication error (401)
 */
export const isAuthError = (error: any): boolean => {
	return error instanceof ErrorStatusCode && error.statusCode === 401;
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error: any): boolean => {
	return error instanceof ErrorStatusCode && error.statusCode === 400;
};

/**
 * Check if error is a not found error (404)
 */
export const isNotFoundError = (error: any): boolean => {
	return error instanceof ErrorStatusCode && error.statusCode === 404;
};
