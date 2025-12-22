import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import { Home, Profile, SignIn, SignUp } from '../pages';
import { AuthRoutes, MainRoutes } from './routes';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
	{
		path: MainRoutes.HOME,
		element: <Home />,
	},
	{
		path: AuthRoutes.SIGN_IN,
		element: <SignIn />,
	},
	{
		path: AuthRoutes.SIGN_UP,
		element: <SignUp />,
	},
	{
		path: MainRoutes.PROFILE,
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
	{
		path: '*',
		element: <Navigate to={MainRoutes.HOME} replace />,
	},
]);
