import { Alert, Box, Button, CircularProgress, Link, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { loginUser } from '../redux/slices/user/asyncReducers';
import { getErrorMessage, validateLoginForm } from '../utils';
import { MainRoutes, AuthRoutes } from '../routes/routes';
import { EmailField, PasswordField } from '../components/fields';

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

		// Validate all fields
		const validation = validateLoginForm(email, password, t);
		if (!validation.isValid) {
			// Validation errors are shown in the field components
			return;
		}

		setLoading(true);

		try {
			await dispatch(loginUser({ email, password })).unwrap();
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
				{t('auth.signIn')}
			</Typography>

			<Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<EmailField value={email} onChange={setEmail} disabled={loading} autoFocus />

				<PasswordField value={password} onChange={setPassword} disabled={loading} mode="login" />

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
	);
};
