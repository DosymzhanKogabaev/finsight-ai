import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from '../components';
import { AuthRoutes } from '../routes/routes';

export const Home = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<AppLayout>
			<AppHeader title="FinSight AI" rightContent={<LanguageSwitcher />} />

			<PageContainer centerContent>
				<Container maxWidth="sm">
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
							{t('common.welcome')}
						</Typography>

						<Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
							FinSight AI - Your Financial Insights Platform
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
							<Button
								variant="contained"
								size="large"
								startIcon={<LoginIcon />}
								onClick={() => navigate(AuthRoutes.SIGN_IN)}
								sx={{ py: 1.5 }}
							>
								{t('auth.signIn')}
							</Button>

							<Button
								variant="outlined"
								size="large"
								startIcon={<PersonAddIcon />}
								onClick={() => navigate(AuthRoutes.SIGN_UP)}
								sx={{ py: 1.5 }}
							>
								{t('auth.signUp')}
							</Button>
						</Box>
					</Box>
				</Container>
			</PageContainer>
		</AppLayout>
	);
};
