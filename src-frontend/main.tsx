import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './i18n/config'; // Initialize i18next
import './index.css';
import { store } from './redux/store';
import { router } from './routes';
import { theme } from './theme/theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<ReduxProvider store={store}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</ReduxProvider>
);
