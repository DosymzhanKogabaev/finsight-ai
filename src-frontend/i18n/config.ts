import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import kk from './locales/kk.json';
import ru from './locales/ru.json';

// Get saved language from localStorage or detect browser language
const savedLanguage = localStorage.getItem('i18nextLng');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = savedLanguage || (['en', 'ru', 'kk'].includes(browserLanguage) ? browserLanguage : 'en');

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		ru: { translation: ru },
		kk: { translation: kk },
	},
	lng: defaultLanguage,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false, // React already escapes values
	},
	react: {
		useSuspense: false,
	},
});

export default i18n;
