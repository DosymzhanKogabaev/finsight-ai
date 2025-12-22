import { createTheme } from '@mui/material/styles';

// Create a custom theme
export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#3b82f6', // Blue
			light: '#60a5fa',
			dark: '#2563eb',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#8b5cf6', // Purple
			light: '#a78bfa',
			dark: '#7c3aed',
			contrastText: '#ffffff',
		},
		error: {
			main: '#ef4444',
			light: '#f87171',
			dark: '#dc2626',
		},
		warning: {
			main: '#f59e0b',
			light: '#fbbf24',
			dark: '#d97706',
		},
		info: {
			main: '#3b82f6',
			light: '#60a5fa',
			dark: '#2563eb',
		},
		success: {
			main: '#10b981',
			light: '#34d399',
			dark: '#059669',
		},
		background: {
			default: '#f9fafb',
			paper: '#ffffff',
		},
		text: {
			primary: '#1f2937',
			secondary: '#6b7280',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		h1: {
			fontWeight: 700,
			fontSize: '2.5rem',
		},
		h2: {
			fontWeight: 600,
			fontSize: '2rem',
		},
		h3: {
			fontWeight: 600,
			fontSize: '1.75rem',
		},
		h4: {
			fontWeight: 600,
			fontSize: '1.5rem',
		},
		h5: {
			fontWeight: 500,
			fontSize: '1.25rem',
		},
		h6: {
			fontWeight: 500,
			fontSize: '1rem',
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 500,
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: 'outlined',
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
			},
		},
	},
});

// Dark theme variant
export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#3b82f6',
			light: '#60a5fa',
			dark: '#2563eb',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#8b5cf6',
			light: '#a78bfa',
			dark: '#7c3aed',
			contrastText: '#ffffff',
		},
		background: {
			default: '#111827',
			paper: '#1f2937',
		},
		text: {
			primary: '#f9fafb',
			secondary: '#d1d5db',
		},
	},
	typography: {
		fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 500,
				},
			},
		},
	},
});
