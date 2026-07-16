import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enResources } from './locales/resources';
import { zhCNResources } from './locales/resources';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enResources },
    zh_CN: { translation: zhCNResources }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
