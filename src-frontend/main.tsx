import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './i18n/config'; // Initialize i18next
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
