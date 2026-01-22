import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface AppHeaderProps {
	title?: string;
	leftContent?: ReactNode;
	rightContent?: ReactNode;
}

/**
 * Responsive app header with centered max-width content
 * Matches the layout system for consistent alignment
 */
export const AppHeader = ({ title, leftContent, rightContent }: AppHeaderProps) => {
	return (
		<AppBar position="static" color="default" elevation={4}>
			<Toolbar>
				<Box
					sx={{
						width: '100%',
						mx: 'auto',
						px: { xs: 2, sm: 3, md: 4 },
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					{/* Left content or title */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{leftContent ||
							(title && (
								<Typography variant="h6" component="h1" noWrap>
									{title}
								</Typography>
							))}
					</Box>

					{/* Right content (e.g., language switcher, user menu) */}
					{rightContent && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{rightContent}</Box>}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
