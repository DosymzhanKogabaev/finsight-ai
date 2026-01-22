import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { MainRoutes } from '../../routes/routes/main';
import { ThemeLanguageSwitchers } from '../common/ThemeLanguageSwitchers';
import { BottomNav } from './BottomNav';
import { AppHeader } from './AppHeader';
import { PageContainer } from './PageContainer';

interface AppLayoutProps {
	children: ReactNode;
}

/**
 * Mobile-first responsive layout component
 *
 * This is the top-level wrapper for your entire app.
 * Individual components (AppHeader, PageContainer) handle their own max-width and centering.
 */
export const AppLayout = ({ children }: AppLayoutProps) => {
	const { t } = useTranslation();
	const location = useLocation();

	// Show bottom nav on main app pages (dashboard, transactions, analytics, categories)
	const showBottomNav = [
		MainRoutes.DASHBOARD,
		MainRoutes.TRANSACTIONS,
		MainRoutes.ANALYTICS,
		MainRoutes.CATEGORIES,
	].includes(location.pathname as MainRoutes);

	const showHeader = !showBottomNav;

	return (
		<Box
			sx={{
				width: 'var(--xs)',
				minHeight: '100vh',
				margin: '0 auto',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'background.default',
				paddingBottom: showBottomNav ? '56px' : 0, // Height of BottomNavigation
			}}
		>
			{showHeader && <AppHeader title={t('common.welcome')} rightContent={<ThemeLanguageSwitchers />} />}
			<PageContainer>{children}</PageContainer>
			{showBottomNav && <BottomNav />}
		</Box>
	);
};
