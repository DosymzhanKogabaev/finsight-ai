import { Alert, Box, Button, CircularProgress, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from '../../components';
import { loginUser } from '../../redux/slices/user/asyncReducers';
import { useAppDispatch } from '../../redux/store';
import { AuthRoutes, MainRoutes } from '../../routes/routes';

export const SignIn = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await dispatch(loginUser({ email, password })).unwrap();
			navigate(MainRoutes.PROFILE);
		} catch (err: any) {
			setError(err.message || t('auth.loginFailed'));
		} finally {
			setLoading(false);
		}
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
						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}

						<TextField
							fullWidth
							label={t('auth.email')}
							type="email"
							placeholder={t('auth.email')}
							margin="normal"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
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
							disabled={loading}
						/>

						<Button
							fullWidth
							variant="contained"
							size="large"
							type="submit"
							disabled={loading}
							sx={{ mt: 3, mb: 2 }}
							startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
						>
							{loading ? t('common.loading') : t('auth.signIn')}
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
