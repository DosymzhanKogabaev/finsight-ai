import { Theme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { darkTheme, theme } from '../theme';

type ThemeMode = 'light' | 'dark';

/**
 * Hook for managing theme mode (light/dark)
 * Persists the selection to localStorage
 *
 * Usage:
 * const { themeMode, currentTheme, toggleTheme } = useThemeMode();
 */
export const useThemeMode = () => {
	const [mode, setMode] = useState<ThemeMode>(() => {
		// Get saved theme mode from localStorage
		const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
		if (savedMode && ['light', 'dark'].includes(savedMode)) {
			return savedMode;
		}

		// Check system preference
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return 'light';
	});

	useEffect(() => {
		// Save theme mode to localStorage when it changes
		localStorage.setItem('theme-mode', mode);
	}, [mode]);

	const currentTheme: Theme = useMemo(() => {
		return mode === 'dark' ? darkTheme : theme;
	}, [mode]);

	const toggleTheme = () => {
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	const setThemeMode = (newMode: ThemeMode) => {
		setMode(newMode);
	};

	return {
		themeMode: mode,
		currentTheme,
		toggleTheme,
		setThemeMode,
	};
};
