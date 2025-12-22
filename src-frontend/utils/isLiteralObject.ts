/**
 * Check if value is a plain literal object
 */
export const isLiteralObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null && value.constructor === Object;
};
