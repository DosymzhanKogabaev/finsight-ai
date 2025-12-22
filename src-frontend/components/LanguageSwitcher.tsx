import LanguageIcon from '@mui/icons-material/Language';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<LanguageIcon color="action" />
			<FormControl size="small" sx={{ minWidth: 120 }}>
				<InputLabel id="language-select-label">{t('language.title')}</InputLabel>
				<Select
					labelId="language-select-label"
					id="language-select"
					value={i18n.language}
					label={t('language.title')}
					onChange={(e) => changeLanguage(e.target.value)}
				>
					<MenuItem value="en">{t('language.english')}</MenuItem>
					<MenuItem value="ru">{t('language.russian')}</MenuItem>
					<MenuItem value="kk">{t('language.kazakh')}</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};
