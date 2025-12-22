// import { PlatformsEnum } from '@/src/types/platform';
// import getPlatform from '@/src/utils/getPlatform';
// import { ScreenOrientation } from '@capacitor/screen-orientation';
// import { StatusBar, Style } from '@capacitor/status-bar';
import { PaletteMode } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
	mode: PaletteMode;
	toggleTheme: () => void;
}

const THEME_KEY = 'edres-theme-preference';

// Function to get theme from localStorage
const getStoredTheme = (): PaletteMode | null => {
	try {
		const storedTheme = localStorage.getItem(THEME_KEY);
		if (storedTheme === 'light' || storedTheme === 'dark') {
			return storedTheme as PaletteMode;
		}

		return null;
	} catch (error) {
		console.error('Error accessing localStorage:', error);

		return null;
	}
};

// Function to get system theme preference
const getSystemTheme = (): PaletteMode => {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}

	return 'light';
};

// Function to save theme to localStorage
const saveTheme = (theme: PaletteMode): void => {
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch (error) {
		console.error('Error saving theme to localStorage:', error);
	}
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	// Initialize with stored theme or system preference
	const [mode, setMode] = useState<PaletteMode>(() => {
		const storedTheme = getStoredTheme();
		if (storedTheme) return storedTheme;

		return getSystemTheme();
	});

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			// Only change theme if user hasn't explicitly set a preference
			if (!getStoredTheme()) {
				setMode(e.matches ? 'dark' : 'light');
			}
		};

		// Add event listener for theme changes
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', handleSystemThemeChange);
		} else {
			// Fallback for older browsers
			mediaQuery.addListener(handleSystemThemeChange);
		}
		// if (getPlatform() === PlatformsEnum.IOS || getPlatform() === PlatformsEnum.ANDROID) {
		// 	StatusBar.setStyle({ style: Style.Dark });

		// 	try {
		// 		// Блокируем поворот экрана в портретном режиме
		// 		ScreenOrientation.lock({ orientation: 'portrait' });
		// 	} catch (error) {
		// 		console.error('Failed to lock screen orientation:', error);
		// 	}
		// }

		// Cleanup
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener('change', handleSystemThemeChange);
			} else {
				// Fallback for older browsers
				mediaQuery.removeListener(handleSystemThemeChange);
			}
		};
	}, []);

	const toggleTheme = () => {
		setMode((prevMode) => {
			const newMode = prevMode === 'light' ? 'dark' : 'light';
			saveTheme(newMode);

			return newMode;
		});
	};

	return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
