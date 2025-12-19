import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
			<label htmlFor="language-select" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
				{t('language.title')}:
			</label>
			<select
				id="language-select"
				value={i18n.language}
				onChange={(e) => changeLanguage(e.target.value)}
				style={{
					padding: '0.5rem 0.75rem',
					border: '1px solid #d1d5db',
					borderRadius: '0.375rem',
					backgroundColor: 'white',
					fontSize: '0.875rem',
					cursor: 'pointer',
				}}
			>
				<option value="en">{t('language.english')}</option>
				<option value="ru">{t('language.russian')}</option>
				<option value="kk">{t('language.kazakh')}</option>
			</select>
		</div>
	);
};
