import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
	children: ReactNode;
}

/**
 * Container for page content with responsive max-width
 *
 * Content widths:
 * - xs: 448px (forms, narrow content)
 * - sm: 640px (default for most content)
 * - md: 768px (articles, blog posts)
 * - lg: 1024px (dashboards, wide content)
 * - xl: 1280px (full-width dashboards)
 * - false: no max-width constraint
 */
export const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<Box
			sx={{
				width: '100%',
				mx: 'auto',
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 2, sm: 3, md: 4 },
			}}
		>
			{children}
		</Box>
	);
};
