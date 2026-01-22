import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles';

/**
 * Fintech-focused color palette
 * Clean, minimal, professional design for financial applications
 */
type ThemeMode = 'light' | 'dark';

export const createTheme = (mode: ThemeMode) => {
	return responsiveFontSizes(
		createMuiTheme({
			palette: {
				mode: mode,
				// Primary - trustworthy blue for financial apps
				primary: {
					main: mode === 'dark' ? '#3B82F6' : '#2563EB',
					light: mode === 'dark' ? '#60A5FA' : '#3B82F6',
					dark: mode === 'dark' ? '#2563EB' : '#1E40AF',
					contrastText: '#FFFFFF',
				},
				// Secondary - accent color
				secondary: {
					main: '#6366F1', // Violet-blue for forecast/accent
					light: '#818CF8',
					dark: '#4F46E5',
					contrastText: '#FFFFFF',
				},
				// Background colors
				background: {
					default: mode === 'dark' ? '#0B0F19' : '#F9FAFB', // Main background
					paper: mode === 'dark' ? '#111827' : '#FFFFFF', // Cards, modals
				},
				// Text colors
				text: {
					primary: mode === 'dark' ? '#F9FAFB' : '#111827', // Main text
					secondary: mode === 'dark' ? '#D1D5DB' : '#4B5563', // Captions, secondary text
					disabled: mode === 'dark' ? '#6B7280' : '#9CA3AF', // Placeholders, hints
				},
				// Semantic colors
				error: {
					main: mode === 'dark' ? '#EF4444' : '#DC2626',
					light: mode === 'dark' ? '#F87171' : '#EF4444',
					dark: mode === 'dark' ? '#DC2626' : '#B91C1C',
				},
				warning: {
					main: mode === 'dark' ? '#F59E0B' : '#D97706',
					light: mode === 'dark' ? '#FCD34D' : '#F59E0B',
					dark: mode === 'dark' ? '#D97706' : '#B45309',
				},
				success: {
					main: mode === 'dark' ? '#22C55E' : '#16A34A',
					light: mode === 'dark' ? '#4ADE80' : '#22C55E',
					dark: mode === 'dark' ? '#16A34A' : '#15803D',
				},
				info: {
					main: mode === 'dark' ? '#38BDF8' : '#0284C7',
					light: mode === 'dark' ? '#7DD3FC' : '#38BDF8',
					dark: mode === 'dark' ? '#0EA5E9' : '#0369A1',
				},
				// Dividers and borders
				divider: mode === 'dark' ? '#1F2937' : '#E5E7EB',
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
				MuiCssBaseline: {
					styleOverrides: {
						body: {
							backgroundColor: mode === 'dark' ? '#0B0F19' : '#F9FAFB',
							color: mode === 'dark' ? '#F9FAFB' : '#111827',
						},
					},
				},
				MuiButton: {
					styleOverrides: {
						root: {
							textTransform: 'none',
							fontWeight: 500,
							boxShadow: 'none',
							'&:hover': {
								boxShadow: 'none',
							},
						},
					},
				},
				MuiTextField: {
					defaultProps: {
						variant: 'outlined',
					},
					styleOverrides: {
						root: {
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: mode === 'dark' ? '#1F2937' : '#E5E7EB',
								},
								'&:hover fieldset': {
									borderColor: mode === 'dark' ? '#374151' : '#D1D5DB',
								},
							},
						},
					},
				},
				MuiPaper: {
					styleOverrides: {
						root: {
							backgroundImage: 'none',
							backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF',
							color: mode === 'dark' ? '#F9FAFB' : '#111827',
						},
					},
				},
				MuiCard: {
					styleOverrides: {
						root: {
							borderRadius: 12,
							border: '1px solid ' + (mode === 'dark' ? '#1F2937' : '#E5E7EB'),
							backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF',
							color: mode === 'dark' ? '#F9FAFB' : '#111827',
						},
					},
				},
				MuiCardContent: {
					styleOverrides: {
						root: {
							padding: '16px',
							'&:last-child': {
								paddingBottom: '16px',
							},
						},
					},
				},
				MuiDivider: {
					styleOverrides: {
						root: {
							borderColor: mode === 'dark' ? '#1F2937' : '#E5E7EB',
						},
					},
				},
				MuiAppBar: {
					styleOverrides: {
						root: {
							backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF',
							color: mode === 'dark' ? '#F9FAFB' : '#111827',
						},
					},
				},
			},
		}),
	);
};
/**
 * Financial chart colors
 * Use these for income/expense/forecast visualizations
 */
export const chartColors = {
	income: '#22C55E', // Green
	expense: '#EF4444', // Red
	neutral: '#9CA3AF', // Gray
	forecast: '#6366F1', // Violet-blue
};

// Additional utility colors for light theme
export const lightUtilityColors = {
	subtle: {
		background: '#F3F4F6', // Hovers, highlights
		border: '#D1D5DB', // Strong borders
		primarySubtle: '#DBEAFE', // Primary background for tags, badges
	},
};

// Additional utility colors for dark theme
export const darkUtilityColors = {
	subtle: {
		background: '#1F2933', // Hovers, selects
		border: '#374151', // Strong borders
		primarySubtle: '#1E3A8A', // Primary background for tags, badges
	},
};
