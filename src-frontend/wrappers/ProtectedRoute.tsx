import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/user/userSlice';
import { useAppSelector } from '../redux/store';
import { AuthRoutes } from '../routes/routes';

interface ProtectedRouteProps {
	children: ReactNode;
}

/**
 * Protected route wrapper that redirects to sign-in if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	useEffect(() => {
		if (!isAuthenticated) {
			console.log('User not authenticated, redirecting to sign in');
		}
	}, [isAuthenticated]);

	if (!isAuthenticated) {
		return <Navigate to={AuthRoutes.SIGN_IN} replace />;
	}

	return <>{children}</>;
};
