import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '../providers/ThemeProvider';

export const ThemeToggle = () => {
	const { toggleTheme, mode } = useTheme();
	return (
		<Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
			<IconButton onClick={toggleTheme} color="inherit" size="large">
				{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
			</IconButton>
		</Tooltip>
	);
};
