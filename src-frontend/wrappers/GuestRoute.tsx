import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/user/userSlice';
import { useAppSelector } from '../redux/hooks';
import { MainRoutes } from '../routes/routes';

interface GuestRouteProps {
	children: ReactNode;
}

/**
 * Guest route wrapper that redirects to profile if user is already authenticated
 * Use this for login/register pages
 */
export const GuestRoute = ({ children }: GuestRouteProps) => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	if (isAuthenticated) {
		return <Navigate to={MainRoutes.PROFILE} replace />;
	}

	return <>{children}</>;
};
