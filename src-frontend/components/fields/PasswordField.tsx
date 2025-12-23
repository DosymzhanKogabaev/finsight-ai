import { TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateLoginPassword, validateRegisterPassword } from '../../utils/validators';

interface PasswordFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	mode?: 'login' | 'register';
	autoFocus?: boolean;
}

export const PasswordField = ({ value, onChange, disabled = false, mode = 'login', autoFocus = false }: PasswordFieldProps) => {
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);

	const handleBlur = () => {
		const validationError = mode === 'login' ? validateLoginPassword(value, t) : validateRegisterPassword(value, t);
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
			label={t('auth.password')}
			type="password"
			placeholder={t('auth.password')}
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
