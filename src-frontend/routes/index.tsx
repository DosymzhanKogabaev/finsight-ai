import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components';
import { AppRoutes } from './AppRoutes';
import { MainRoutes } from './routes';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
	{
		path: '/*',
		element: (
			<AppLayout>
				<AppRoutes />
			</AppLayout>
		),
	},
	{
		path: '*',
		element: <Navigate to={MainRoutes.HOME} replace />,
	},
]);
