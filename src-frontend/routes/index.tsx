import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '../pages';
import { AuthRoutes } from './routes';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to={AuthRoutes.SIGN_UP} replace />,
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
		path: '*',
		element: <Navigate to={AuthRoutes.SIGN_UP} replace />,
	},
]);
