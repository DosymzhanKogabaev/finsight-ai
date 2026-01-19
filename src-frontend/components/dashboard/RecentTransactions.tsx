import { TransactionResponse } from '@/shared';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MainRoutes } from '../../routes/routes/main';

interface RecentTransactionsProps {
	transactions: TransactionResponse[];
	currency?: string;
}

/**
 * Recent Transactions Component
 * Displays a list of recent transactions with category icons, amounts, and dates
 */
export const RecentTransactions = ({ transactions, currency = '₸' }: RecentTransactionsProps) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const navigate = useNavigate();

	const formatAmount = (amount: number, type: 'income' | 'expense') => {
		const sign = type === 'income' ? '+' : '-';
		return `${sign}${currency}${Math.abs(amount).toLocaleString()}`;
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		const month = date.toLocaleDateString('en', { month: 'short' });
		const day = date.getDate();
		return `${month} ${day}`;
	};

	const handleViewAll = () => {
		navigate(MainRoutes.TRANSACTIONS);
	};

	if (transactions.length === 0) {
		return (
			<Card>
				<CardContent>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="h6">{t('dashboard.recentTransactions')}</Typography>
					</Box>
					<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
						{t('dashboard.noTransactions')}
					</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant="h6">{t('dashboard.recentTransactions')}</Typography>
					<Box
						onClick={handleViewAll}
						sx={{
							display: 'flex',
							alignItems: 'center',
							cursor: 'pointer',
							color: 'primary.main',
							'&:hover': {
								opacity: 0.8,
							},
						}}
					>
						<Typography variant="body2" sx={{ fontWeight: 500 }}>
							{t('dashboard.viewAll')}
						</Typography>
						<ChevronRightIcon sx={{ fontSize: 20 }} />
					</Box>
				</Box>

				<List sx={{ p: 0 }}>
					{transactions.map((transaction, index) => {
						const isLast = index === transactions.length - 1;
						const isIncome = transaction.category.type === 'income';

						return (
							<Box key={transaction.id}>
								<ListItem sx={{ px: 0, py: 1.5 }}>
									<ListItemAvatar>
										<Avatar
											sx={{
												bgcolor: transaction.category.color || theme.palette.primary.main,
												width: 44,
												height: 44,
											}}
										>
											{transaction.category.icon || '💰'}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Typography variant="body1" fontWeight={500}>
												{transaction.description || transaction.category.name}
											</Typography>
										}
										secondary={
											<Typography variant="body2" color="text.secondary">
												{transaction.category.name}
											</Typography>
										}
									/>
									<Box sx={{ textAlign: 'right' }}>
										<Typography
											variant="body1"
											fontWeight={600}
											sx={{
												color: isIncome ? 'success.main' : 'text.primary',
											}}
										>
											{formatAmount(transaction.amount, transaction.category.type)}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{formatDate(transaction.occurred_at)}
										</Typography>
									</Box>
								</ListItem>
								{!isLast && <Divider />}
							</Box>
						);
					})}
				</List>
			</CardContent>
		</Card>
	);
};
