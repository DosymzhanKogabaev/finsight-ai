import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createTheme } from '../theme/theme';
import { useTheme } from './ThemeProvider';

type Props = {
	children?: React.ReactNode;
};

export const MuiThemeProviderWrapper: React.FC<Props> = ({ children }) => {
	const { mode } = useTheme();
	const theme = createTheme(mode);

	return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
