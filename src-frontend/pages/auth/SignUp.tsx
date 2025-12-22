import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from '../../components';
import { AuthRoutes } from '../../routes/routes';

export const SignUp = () => {
	const [isVerified, setIsVerified] = useState(false);
	const [token, setToken] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { t, i18n } = useTranslation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Sign up:', { fullName, email, password, token });
		// TODO: Implement sign up logic
	};

	return (
		<AppLayout>
			<AppHeader title={t('common.welcome')} rightContent={<LanguageSwitcher />} />

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

					<Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
						<TextField
							fullWidth
							label={t('auth.fullName')}
							placeholder={t('auth.fullName')}
							margin="normal"
							required
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>

						<TextField
							fullWidth
							label={t('auth.email')}
							type="email"
							placeholder={t('auth.email')}
							margin="normal"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<TextField
							fullWidth
							label={t('auth.password')}
							type="password"
							placeholder={t('auth.password')}
							margin="normal"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

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

						<Button fullWidth variant="contained" size="large" type="submit" disabled={!isVerified} sx={{ mt: 2, mb: 2 }}>
							{t('common.register')}
						</Button>

						<Box sx={{ textAlign: 'center' }}>
							<Typography variant="body2" color="text.secondary">
								{t('auth.alreadyHaveAccount')}{' '}
								<Link component={RouterLink} to={AuthRoutes.SIGN_IN} underline="hover">
									{t('auth.signIn')}
								</Link>
							</Typography>
						</Box>
					</Box>
				</Paper>
			</PageContainer>
		</AppLayout>
	);
};
