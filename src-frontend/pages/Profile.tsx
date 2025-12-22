import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppHeader, AppLayout, LanguageSwitcher, PageContainer } from '../components';
import { getMe } from '../redux/slices/user/asyncReducers';
import { logout, selectCurrentUser } from '../redux/slices/user/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { AuthRoutes } from '../routes/routes';

export const Profile = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				setError(null);
				await dispatch(getMe()).unwrap();
			} catch (err: any) {
				console.error('Failed to fetch user data:', err);
				setError(err.message || t('error.generic'));
				// If unauthorized, logout and redirect
				if (err.statusCode === 401) {
					dispatch(logout());
					navigate(AuthRoutes.SIGN_IN);
				}
			} finally {
				setLoading(false);
			}
		};

		if (!currentUser) {
			fetchUserData();
		} else {
			setLoading(false);
		}
	}, [currentUser, dispatch, navigate, t]);

	const handleLogout = () => {
		dispatch(logout());
		navigate(AuthRoutes.SIGN_IN);
	};

	if (loading) {
		return (
			<AppLayout>
				<AppHeader title={t('profile.title')} rightContent={<LanguageSwitcher />} />
				<PageContainer centerContent>
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
						<CircularProgress />
					</Box>
				</PageContainer>
			</AppLayout>
		);
	}

	if (error || !currentUser) {
		return (
			<AppLayout>
				<AppHeader title={t('profile.title')} rightContent={<LanguageSwitcher />} />
				<PageContainer centerContent>
					<Alert severity="error" sx={{ maxWidth: 600 }}>
						{error || t('error.generic')}
					</Alert>
				</PageContainer>
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<AppHeader title={t('profile.title')} rightContent={<LanguageSwitcher />} />

			<PageContainer>
				<Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
					<CardContent sx={{ p: 4 }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
							<Avatar src={currentUser.avatar_url || undefined} sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}>
								{!currentUser.avatar_url && <PersonIcon sx={{ fontSize: 60 }} />}
							</Avatar>
							<Typography variant="h4" sx={{ fontWeight: 600 }}>
								{currentUser.full_name}
							</Typography>
						</Box>

						<Divider sx={{ my: 3 }} />

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<EmailIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('auth.email')}
									</Typography>
									<Typography variant="body1">{currentUser.email}</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<PersonIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('auth.fullName')}
									</Typography>
									<Typography variant="body1">{currentUser.full_name}</Typography>
								</Box>
							</Box>
						</Box>

						<Divider sx={{ my: 3 }} />

						<Button fullWidth variant="outlined" color="error" size="large" startIcon={<LogoutIcon />} onClick={handleLogout}>
							{t('auth.signOut')}
						</Button>
					</CardContent>
				</Card>
			</PageContainer>
		</AppLayout>
	);
};
