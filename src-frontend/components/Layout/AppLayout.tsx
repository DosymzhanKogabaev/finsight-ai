import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';
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
	return (
		<Box
			sx={{
				width: 'var(--xs)',
				minHeight: '100vh',
				margin: '0 auto',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'background.default',
			}}
		>
			<AppHeader title={t('common.welcome')} rightContent={<LanguageSwitcher />} />
			<PageContainer>{children}</PageContainer>
		</Box>
	);
};
