import { Alert, Box, Button, CircularProgress, Link, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { useAppDispatch } from '../redux/hooks';
import { registerUser } from '../redux/slices/user/asyncReducers';
import { getErrorMessage, validateRegisterForm } from '../utils';
import { AuthRoutes, MainRoutes } from '../routes/routes';
import { EmailField, FullNameField, PasswordField } from '../components/fields';

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

		// Validate all fields
		const validation = validateRegisterForm(fullName, email, password, t);
		if (!validation.isValid) {
			// Validation errors are shown in the field components
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
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Paper
			elevation={4}
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

				<FullNameField value={fullName} onChange={setFullName} disabled={loading} autoFocus />

				<EmailField value={email} onChange={setEmail} disabled={loading} />

				<PasswordField value={password} onChange={setPassword} disabled={loading} mode="register" />

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
