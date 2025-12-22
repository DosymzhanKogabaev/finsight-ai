import { Alert, Box, Button, CircularProgress, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { registerUser } from '../../redux/slices/user/asyncReducers';
import { useAppDispatch } from '../../redux/store';
import { AuthRoutes, MainRoutes } from '../../routes/routes';

export const SignUp = () => {
	const [isVerified, setIsVerified] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isVerified) {
			setError(t('turnstile.failed'));
			return;
		}

		setError(null);
		setLoading(true);

		try {
			await dispatch(
				registerUser({
					full_name: fullName,
					email,
					password,
					turnstile_token: turnstileToken,
				})
			).unwrap();
			navigate(MainRoutes.PROFILE);
		} catch (err: any) {
			setError(err.message || t('auth.registerFailed'));
			// TODO: retry turnstile
		} finally {
			setLoading(false);
		}
	};
	// TODO: add validators for email, password, full name
	// TODO: add proper error handling through i18n (probably global handler)

	return (
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
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<TextField
					fullWidth
					label={t('auth.fullName')}
					placeholder={t('auth.fullName')}
					margin="normal"
					required
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					disabled={loading}
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

				<Box sx={{ my: 3, display: 'flex', justifyContent: 'center', height: '72px' }}>
					<Turnstile
						sitekey="0x4AAAAAACHWD8GD0z7k1dXg"
						language={i18n.language}
						onVerify={(token) => {
							setTurnstileToken(token);
							setIsVerified(true);
						}}
						theme="light"
						retry="auto"
						retryInterval={1000}
						onError={() => {
							setIsVerified(false);
							setError(t('turnstile.failed'));
						}}
					/>
				</Box>

				<Button
					fullWidth
					variant="contained"
					size="large"
					type="submit"
					disabled={!isVerified || loading}
					sx={{ mt: 2, mb: 2 }}
					startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
				>
					{loading ? t('common.loading') : t('common.register')}
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
	);
};
