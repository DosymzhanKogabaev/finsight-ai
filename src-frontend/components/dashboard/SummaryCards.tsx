import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SummaryCardData {
	label: string;
	amount: number;
	change: number; // Percentage change
	isPositive: boolean;
	type: 'income' | 'expense' | 'net';
}

interface SummaryCardsProps {
	income: SummaryCardData;
	expenses: SummaryCardData;
	net: SummaryCardData;
	currency?: string;
}

/**
 * Summary Cards Component
 * Displays three cards showing Income, Expenses, and Net balance with trend indicators
 */
export const SummaryCards = ({ income, expenses, net, currency = '₸' }: SummaryCardsProps) => {
	const { t } = useTranslation();
	const theme = useTheme();

	const formatAmount = (amount: number) => {
		return `${amount >= 0 ? '+' : ''}${currency}${Math.abs(amount).toLocaleString()}`;
	};

	const formatChange = (change: number) => {
		const sign = change >= 0 ? '+' : '';
		return `${sign}${change}%`;
	};

	const getCardColor = (type: 'income' | 'expense' | 'net') => {
		if (type === 'income') return theme.palette.success.main;
		if (type === 'expense') return theme.palette.error.main;
		return theme.palette.info.main;
	};

	const renderCard = (data: SummaryCardData) => {
		const cardColor = getCardColor(data.type);

		return (
			<Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
							{data.type === 'income' && <ArrowUpwardIcon sx={{ fontSize: 16, color: 'success.main' }} />}
							{data.type === 'expense' && <ArrowDownwardIcon sx={{ fontSize: 16, color: 'error.main' }} />}
							{data.type === 'net' && <ArrowUpwardIcon sx={{ fontSize: 16, color: 'info.main' }} />}
							<Typography variant="body2" color="text.secondary">
								{data.label}
							</Typography>
						</Box>

						<Typography variant="h5" fontWeight={600} sx={{ mb: 0.5, color: cardColor }}>
							{formatAmount(data.amount)}
						</Typography>

						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							{data.isPositive ? (
								<ArrowUpwardIcon sx={{ fontSize: 14, color: 'success.main' }} />
							) : (
								<ArrowDownwardIcon sx={{ fontSize: 14, color: 'error.main' }} />
							)}
							<Typography
								variant="caption"
								sx={{
									color: data.isPositive ? 'success.main' : 'error.main',
									fontWeight: 500,
								}}
							>
								{formatChange(data.change)}
							</Typography>
							{data.type === 'net' && (
								<Typography
									variant="caption"
									sx={{
										ml: 0.5,
										color: data.isPositive ? 'success.main' : 'error.main',
										fontWeight: 500,
									}}
								>
									{data.isPositive ? t('dashboard.good') : t('dashboard.poor')}
								</Typography>
							)}
						</Box>
					</CardContent>
				</Card>
			</Box>
		);
	};

	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
			{renderCard(income)}
			{renderCard(expenses)}
			{renderCard(net)}
		</Box>
	);
};
