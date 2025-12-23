import { TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateEmail } from '../../utils/validators';

interface EmailFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	autoFocus?: boolean;
}

export const EmailField = ({ value, onChange, disabled = false, autoFocus = false }: EmailFieldProps) => {
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);

	const handleBlur = () => {
		const validationError = validateEmail(value, t);
		setError(validationError);
	};

	const handleChange = (newValue: string) => {
		onChange(newValue);
		if (error) {
			setError(null);
		}
	};

	return (
		<TextField
			fullWidth
			label={t('auth.email')}
			placeholder={t('auth.email')}
			margin="normal"
			value={value}
			onChange={(e) => handleChange(e.target.value)}
			onBlur={handleBlur}
			disabled={disabled}
			error={!!error}
			helperText={error}
			autoFocus={autoFocus}
		/>
	);
};
