import AddIcon from '@mui/icons-material/Add';
import { Box, Card, CardContent, Fab, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExpenseBreakdown, RecentTransactions, SummaryCards } from '../components/dashboard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getCategories } from '../redux/slices/categories/asyncReducers';
import { getTransactions } from '../redux/slices/transactions/asyncReducers';
import { selectTransactions } from '../redux/slices/transactions/transactionsSlice';
import { formatAmount } from '../utils';

/**
 * Dashboard page - Main view with balance, expense breakdown, and recent transactions
 */
export const Dashboard = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();

	const transactions = useAppSelector(selectTransactions);

	const [selectedMonth, setSelectedMonth] = useState(() => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	});

	// Fetch data on mount
	useEffect(() => {
		dispatch(getCategories());

		// Get transactions for current month
		const [year, month] = selectedMonth.split('-').map(Number);
		const fromDate = new Date(year, month - 1, 1);
		const toDate = new Date(year, month, 0, 23, 59, 59);

		dispatch(
			getTransactions({
				from: Math.floor(fromDate.getTime() / 1000),
				to: Math.floor(toDate.getTime() / 1000),
				limit: 100,
			}),
		);
	}, [dispatch, selectedMonth]);

	// Calculate summary data
	const summaryData = useMemo(() => {
		const income = transactions.filter((t) => t.category.type === 'income').reduce((sum, t) => sum + t.amount, 0);

		const expenses = transactions.filter((t) => t.category.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

		// Mock percentage changes (in a real app, compare with previous period)
		return {
			income: {
				label: t('dashboard.income'),
				amount: income,
				change: 12,
				isPositive: true,
				type: 'income' as const,
			},
			expenses: {
				label: t('dashboard.expenses'),
				amount: expenses,
				change: -5,
				isPositive: true,
				type: 'expense' as const,
			},
			totalBalance: income - expenses,
		};
	}, [transactions, t]);

	// Calculate expense breakdown by category
	const expenseBreakdown = useMemo(() => {
		const expenseTransactions = transactions.filter((t) => t.category.type === 'expense');

		// Group by category
		const categoryTotals = expenseTransactions.reduce(
			(acc, t) => {
				if (!acc[t.category.id]) {
					acc[t.category.id] = {
						name: t.category.name,
						value: 0,
						color: t.category.color || theme.palette.primary.main,
					};
				}
				acc[t.category.id].value += t.amount;
				return acc;
			},
			{} as Record<number, { name: string; value: number; color: string }>,
		);

		return Object.values(categoryTotals);
	}, [transactions, theme]);

	// Get recent transactions (last 5)
	const recentTransactions = useMemo(() => {
		return [...transactions].sort((a, b) => b.occurred_at - a.occurred_at).slice(0, 5);
	}, [transactions]);

	// Generate month options (last 12 months)
	const monthOptions = useMemo(() => {
		const options = [];
		const now = new Date();
		for (let i = 0; i < 12; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const label = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
			options.push({ value, label });
		}
		return options;
	}, []);

	return (
		<Box>
			{/* Header with balance and month selector */}
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
					<Typography variant="h1" fontWeight={700}>
						{t('dashboard.title')}
					</Typography>
					<AddIcon sx={{ fontSize: 28, color: 'text.primary', cursor: 'pointer' }} />
				</Box>

				<Card elevation={4}>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Box>
								<Typography variant="body2" color="text.secondary" gutterBottom>
									{t('dashboard.totalBalance')}
								</Typography>
								<Typography variant="h3" fontWeight={700}>
									{formatAmount(summaryData.totalBalance, {showSign: true})}
								</Typography>
							</Box>
							<Select
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(e.target.value)}
								size="small"
								sx={{ minWidth: 150 }}
							>
								{monthOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</Box>
					</CardContent>
				</Card>
			</Box>

			{/* Summary Cards */}
			<Box sx={{ mb: 1 }}>
				<SummaryCards income={summaryData.income} expenses={summaryData.expenses} />
			</Box>

			{/* Expense Breakdown Chart */}
			{expenseBreakdown.length > 0 && (
				<Box sx={{ mb: 1 }}>
					<ExpenseBreakdown data={expenseBreakdown} />
				</Box>
			)}

			{/* Recent Transactions */}
			<Box>
				<RecentTransactions transactions={recentTransactions} />
			</Box>

			{/* Floating Action Button for adding transactions */}
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: 72, // Above bottom navigation
					right: 16,
				}}
			>
				<AddIcon />
			</Fab>
		</Box>
	);
};
