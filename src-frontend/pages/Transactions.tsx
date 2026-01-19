import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Transactions page - List and manage all transactions
 */
export const Transactions = () => {
	const { t } = useTranslation();

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				{t('transactions.title')}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				Transactions list coming soon...
			</Typography>
		</Box>
	);
};
