import { TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateFullName } from '../../utils/validators';

interface FullNameFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	autoFocus?: boolean;
}

export const FullNameField = ({ value, onChange, disabled = false, autoFocus = false }: FullNameFieldProps) => {
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);

	const handleBlur = () => {
		const validationError = validateFullName(value, t);
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
			label={t('auth.fullName')}
			placeholder={t('auth.fullName')}
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
