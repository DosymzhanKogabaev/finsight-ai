import { Route, Routes } from 'react-router-dom';
import { Analytics, Categories, Dashboard, Home, Profile, SignIn, SignUp, Transactions } from '../pages';
import { GuestRoute, ProtectedRoute } from '../wrappers';
import { AuthRoutes, MainRoutes } from './routes';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path={MainRoutes.HOME} element={<Home />} />
			<Route
				path={MainRoutes.DASHBOARD}
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path={MainRoutes.TRANSACTIONS}
				element={
					<ProtectedRoute>
						<Transactions />
					</ProtectedRoute>
				}
			/>
			<Route
				path={MainRoutes.ANALYTICS}
				element={
					<ProtectedRoute>
						<Analytics />
					</ProtectedRoute>
				}
			/>
			<Route
				path={MainRoutes.CATEGORIES}
				element={
					<ProtectedRoute>
						<Categories />
					</ProtectedRoute>
				}
			/>
			<Route
				path={AuthRoutes.SIGN_IN}
				element={
					<GuestRoute>
						<SignIn />
					</GuestRoute>
				}
			/>
			<Route
				path={AuthRoutes.SIGN_UP}
				element={
					<GuestRoute>
						<SignUp />
					</GuestRoute>
				}
			/>
			<Route
				path={MainRoutes.PROFILE}
				element={
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};
