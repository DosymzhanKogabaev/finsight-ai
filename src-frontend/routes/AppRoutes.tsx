import { Route, Routes } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '../components';
import { Home, Profile, SignIn, SignUp } from '../pages';
import { AuthRoutes, MainRoutes } from './routes';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path={MainRoutes.HOME} element={<Home />} />
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
