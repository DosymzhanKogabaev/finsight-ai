import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface ExpenseData {
	name: string;
	value: number;
	color: string;
	[key: string]: string | number; // Index signature for recharts compatibility
}

interface ExpenseBreakdownProps {
	data: ExpenseData[];
}

/**
 * Expense Breakdown Component
 * Displays a donut chart showing the distribution of expenses by category
 */
export const ExpenseBreakdown = ({ data }: ExpenseBreakdownProps) => {
	const { t } = useTranslation();

	// Calculate total for percentage display
	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<Card>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					{t('dashboard.expenseBreakdown')}
				</Typography>

				<Box sx={{ position: 'relative', width: '100%', height: 300 }}>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					{/* Center text */}
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							textAlign: 'center',
							pointerEvents: 'none',
						}}
					>
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
							{t('dashboard.expenseBreakdown')}
						</Typography>
					</Box>
				</Box>

				{/* Legend */}
				<Box sx={{ mt: 2 }}>
					{data.map((item, index) => {
						const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
						return (
							<Box
								key={index}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									mb: 1,
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Box
										sx={{
											width: 12,
											height: 12,
											borderRadius: '50%',
											backgroundColor: item.color,
										}}
									/>
									<Typography variant="body2" color="text.secondary">
										{item.name}
									</Typography>
								</Box>
								<Typography variant="body2" fontWeight={500}>
									{percentage}%
								</Typography>
							</Box>
						);
					})}
				</Box>
			</CardContent>
		</Card>
	);
};
