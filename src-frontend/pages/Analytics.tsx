import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Analytics page - Charts and insights about spending patterns
 */
export const Analytics = () => {
	const { t } = useTranslation();

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				{t('analytics.title')}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				Analytics content coming soon...
			</Typography>
		</Box>
	);
};
