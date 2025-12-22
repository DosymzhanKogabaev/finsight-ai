import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './i18n/config'; // Initialize i18next
import './index.css';
import { MuiThemeProviderWrapper } from './providers/MuiThemeProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { store } from './redux/store';
import { router } from './routes';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<ReduxProvider store={store}>
		<ThemeProvider>
			<MuiThemeProviderWrapper>
				<CssBaseline />
				<RouterProvider router={router} />
			</MuiThemeProviderWrapper>
		</ThemeProvider>
	</ReduxProvider>
);
