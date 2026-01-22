import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainRoutes } from '../../routes/routes/main';

/**
 * Bottom navigation component for mobile-first design
 * Shows 4 main tabs: Dashboard, Transactions, Analytics, Categories
 */
export const BottomNav = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	// Determine current tab based on pathname
	const getCurrentTab = () => {
		const path = location.pathname;
		if (path === MainRoutes.DASHBOARD) return 0;
		if (path === MainRoutes.TRANSACTIONS) return 1;
		if (path === MainRoutes.ANALYTICS) return 2;
		if (path === MainRoutes.CATEGORIES) return 3;
		return 0; // Default to dashboard
	};

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		const routes = [MainRoutes.DASHBOARD, MainRoutes.TRANSACTIONS, MainRoutes.ANALYTICS, MainRoutes.CATEGORIES];
		navigate(routes[newValue]);
	};

	return (
		<Paper
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				borderTop: 1,
				borderColor: 'divider',
				width: '100%',
				maxWidth: 'var(--xs)',
				mx: 'auto',
			}}
			elevation={3}
		>
			<BottomNavigation showLabels value={getCurrentTab()} onChange={handleChange}>
				<BottomNavigationAction
					label={t('navigation.dashboard')}
					icon={<HomeOutlinedIcon />}
					sx={{
						'&.Mui-selected': {
							color: 'primary.main',
						},
					}}
				/>
				<BottomNavigationAction
					label={t('navigation.transactions')}
					icon={<ReceiptLongOutlinedIcon />}
					sx={{
						'&.Mui-selected': {
							color: 'primary.main',
						},
					}}
				/>
				<BottomNavigationAction
					label={t('navigation.analytics')}
					icon={<AnalyticsOutlinedIcon />}
					sx={{
						'&.Mui-selected': {
							color: 'primary.main',
						},
					}}
				/>
				<BottomNavigationAction
					label={t('navigation.categories')}
					icon={<CategoryOutlinedIcon />}
					sx={{
						'&.Mui-selected': {
							color: 'primary.main',
						},
					}}
				/>
			</BottomNavigation>
		</Paper>
	);
};
