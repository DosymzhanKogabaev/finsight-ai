import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Turnstile from 'react-turnstile';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from './components';

function App() {
	const [_isVerified, setIsVerified] = useState(false);
	const [token, setToken] = useState('');
	const { t, i18n } = useTranslation();

	return (
		<AppLayout>
			{/* Header with language switcher */}
			<AppHeader title={t('common.welcome')} rightContent={<LanguageSwitcher />} />

			{/* Main Content */}
			<PageContainer centerContent>
				<Paper
					elevation={3}
					sx={{
						p: { xs: 3, sm: 4 },
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Typography component="h2" variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
						{t('auth.signUp')}
					</Typography>

					<Box component="form" sx={{ width: '100%' }}>
						<TextField fullWidth label={t('auth.fullName')} placeholder={t('auth.fullName')} margin="normal" required />

						<TextField fullWidth label={t('auth.email')} type="email" placeholder={t('auth.email')} margin="normal" required />

						<TextField fullWidth label={t('auth.password')} type="password" placeholder={t('auth.password')} margin="normal" required />

						<Box sx={{ my: 3, display: 'flex', justifyContent: 'center', height: '72px' }}>
							<Turnstile
								sitekey="0x4AAAAAACHWD8GD0z7k1dXg"
								language={i18n.language}
								onVerify={(token) => {
									setToken(token);
									setIsVerified(true);
								}}
								theme="light"
								retry="auto"
								retryInterval={1000}
								onError={() => {
									console.log('error');
								}}
							/>
						</Box>

						<Button fullWidth variant="contained" size="large" onClick={() => console.log(token)} sx={{ mt: 2, mb: 2 }}>
							{t('common.register')}
						</Button>

						<Box sx={{ textAlign: 'center' }}>
							<Typography variant="body2" color="text.secondary">
								{t('auth.alreadyHaveAccount')}{' '}
								<Link href="#" underline="hover">
									{t('auth.signIn')}
								</Link>
							</Typography>
						</Box>
					</Box>
				</Paper>
			</PageContainer>
		</AppLayout>
	);
}

export default App;
