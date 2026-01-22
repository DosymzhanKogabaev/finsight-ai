import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { formatAmount } from '../../utils';

interface SummaryCardData {
	label: string;
	amount: number; // Amount in cents/tiyin
	change: number; // Percentage change
	isPositive: boolean;
	type: 'income' | 'expense';
}

interface SummaryCardsProps {
	income: SummaryCardData;
	expenses: SummaryCardData;
	currency?: string;
}

/**
 * Summary Cards Component
 * Displays two cards showing Income and Expenses with trend indicators
 */
export const SummaryCards = ({ income, expenses, currency = '₸' }: SummaryCardsProps) => {
	const theme = useTheme();

	const formatChange = (change: number) => {
		const sign = change >= 0 ? '+' : '';
		return `${sign}${change}%`;
	};

	const getCardColor = (type: 'income' | 'expense') => {
		if (type === 'income') return theme.palette.success.main;
		return theme.palette.error.main;
	};

	const renderCard = (data: SummaryCardData) => {
		const cardColor = getCardColor(data.type);
		const formattedAmount = formatAmount(data.amount, {
			currency,
			showSign: false,
		});

		return (
			<Card elevation={4} sx={{ flex: 1 }}>
				<CardContent>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
						{data.type === 'income' ? (
							<ArrowUpwardIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />
						) : (
							<ArrowDownwardIcon sx={{ fontSize: 16, color: 'error.main', flexShrink: 0 }} />
						)}
						<Typography
							variant="body1"
							color={cardColor}
							sx={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{data.label}
						</Typography>
					</Box>

					<Typography
						color="text.primary"
						variant={formattedAmount.length > 15 ? 'h4' : formattedAmount.length > 10 ? 'h3' : 'h2'}
						sx={{
							mb: 0.5,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{formattedAmount}
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						{data.isPositive ? (
							<ArrowUpwardIcon sx={{ fontSize: 14, color: 'success.main', flexShrink: 0 }} />
						) : (
							<ArrowDownwardIcon sx={{ fontSize: 14, color: 'error.main', flexShrink: 0 }} />
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
					</Box>
				</CardContent>
			</Card>
		);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
			{renderCard(income)}
			{renderCard(expenses)}
		</Box>
	);
};
