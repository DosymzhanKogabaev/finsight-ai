import { Route, Routes } from 'react-router-dom';
import { Home, Profile, SignIn, SignUp } from '../pages';
import { AuthRoutes, MainRoutes } from './routes';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path={MainRoutes.HOME} element={<Home />} />
			<Route path={AuthRoutes.SIGN_IN} element={<SignIn />} />
			<Route path={AuthRoutes.SIGN_UP} element={<SignUp />} />
			<Route path={MainRoutes.PROFILE} element={<Profile />} />
		</Routes>
	);
};
