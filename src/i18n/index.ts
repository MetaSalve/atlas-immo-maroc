
import { useI18n } from '@/providers/I18nProvider';

// Fonction de traduction qui utilise notre provider
export const useTranslation = () => {
  const { t } = useI18n();
  return { t };
};

// Re-export des autres modules
export { useLanguageSwitch } from './hooks/useLanguageSwitch';
export { languageNames, LANGUAGE_STORAGE_KEY } from './constants';
export { default as i18n } from './i18nConfig';
