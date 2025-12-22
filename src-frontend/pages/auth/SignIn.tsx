import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from '../../components';
import { AuthRoutes } from '../../routes/routes';

export const SignIn = () => {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Sign in:', { email, password });
		// TODO: Implement sign in logic
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
						{t('auth.signIn')}
					</Typography>

					<Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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

						<Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 3, mb: 2 }}>
							{t('auth.signIn')}
						</Button>

						<Box sx={{ textAlign: 'center' }}>
							<Typography variant="body2" color="text.secondary">
								{t('auth.dontHaveAccount')}{' '}
								<Link component={RouterLink} to={AuthRoutes.SIGN_UP} underline="hover">
									{t('auth.signUp')}
								</Link>
							</Typography>
						</Box>
					</Box>
				</Paper>
			</PageContainer>
		</AppLayout>
	);
};
