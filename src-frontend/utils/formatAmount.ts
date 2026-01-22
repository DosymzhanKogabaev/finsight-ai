/**
 * Format amount utility functions
 * Amounts are stored as integers (cents/tiyin) in the database
 * This utility converts them to decimal format for display
 */

interface FormatAmountOptions {
	/**
	 * Currency symbol to use (default: ₸)
	 */
	currency?: string;
	/**
	 * Whether to show sign prefix (+/-)
	 * Default: false
	 */
	showSign?: boolean;
	/**
	 * Whether to always show + for positive amounts
	 * Only applies when showSign is true
	 * Default: false
	 */
	showPlusSign?: boolean;
	/**
	 * Locale to use for number formatting
	 * Default: 'en-US'
	 */
	locale?: string;
	/**
	 * Number of decimal places
	 * Default: 2
	 */
	decimals?: number;
}

/**
 * Format amount from database integer to display string
 * @param amount - Amount in cents/tiyin (integer from database)
 * @param options - Formatting options
 * @returns Formatted amount string with currency symbol
 *
 * @example
 * formatAmount(10000) // "₸100.00"
 * formatAmount(10000, { showSign: true, showPlusSign: true }) // "+₸100.00"
 * formatAmount(-5000, { showSign: true }) // "-₸50.00"
 * formatAmount(125050) // "₸1,250.50"
 */
export const formatAmount = (amount: number, options: FormatAmountOptions = {}): string => {
	const { currency = '₸', showSign = false, showPlusSign = false, locale = 'en-US', decimals = 2 } = options;

	// Convert from cents/tiyin to main currency (divide by 100)
	const amountInMainCurrency = amount / 100;
	const absAmount = Math.abs(amountInMainCurrency);

	// Format the number with locale and decimals
	const formattedNumber = absAmount.toLocaleString(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});

	// Build the final string with optional sign
	let result = `${currency}${formattedNumber}`;

	if (showSign) {
		if (amountInMainCurrency < 0) {
			result = `-${result}`;
		} else if (showPlusSign) {
			result = `+${result}`;
		}
	}

	return result;
};

/**
 * Format transaction amount based on type (income/expense)
 * Shows + for income and - for expenses
 *
 * @param amount - Amount in cents/tiyin (integer from database)
 * @param type - Transaction type ('income' or 'expense')
 * @param currency - Currency symbol (default: ₸)
 * @returns Formatted amount string with +/- sign
 *
 * @example
 * formatTransactionAmount(10000, 'income') // "+₸100.00"
 * formatTransactionAmount(5000, 'expense') // "-₸50.00"
 */
export const formatTransactionAmount = (amount: number, type: 'income' | 'expense', currency: string = '₸'): string => {
	const sign = type === 'income' ? '+' : '-';
	const amountInMainCurrency = Math.abs(amount) / 100;

	const formattedNumber = amountInMainCurrency.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return `${sign}${currency}${formattedNumber}`;
};
