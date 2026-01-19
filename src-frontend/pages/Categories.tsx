import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Categories page - Manage income and expense categories
 */
export const Categories = () => {
	const { t } = useTranslation();

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				{t('categories.title')}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				Categories management coming soon...
			</Typography>
		</Box>
	);
};
