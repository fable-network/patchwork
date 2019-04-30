import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import moment from 'moment';
import i18nConfig from '../../ft-config/i18n';
import LanguageDetector from './language-detector';

const reportMissingLabel = (key) => {
  console.log(`Missing translation key ${key}!`);
  return key;
};

const isDev = fashionTradeSettings.environment === 'dev';
const isTest = fashionTradeSettings.environment === 'test';

const config = {
  backend: {
    // This has to be point to the correct google cloud bucket that contains this apps translation
    // files. (e.g https://storage.googleapis.com/app-service-translations/{{lng}}/{{ns}}.json)
    loadPath: '',
    crossDomain: true,
  },
  useLocaleQueryParam: true, // Uses locale query param to set user language if present.
  parseMissingKeyHandler: (key) => reportMissingLabel(key),
  debug: isDev || isTest,
  lngs: i18nConfig.languages,
  whitelist: i18nConfig.languages,
  load: 'currentOnly',
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  fallbackLng: i18nConfig.defaultLanguage, // this will fallback to key ideal for en as default
  // saveMissingPlurals: true,
  // saveMissing: true,
  nsSeparator: ':',
  keySeparator: '.',
  pluralSeparator: '_',
  contextSeparator: '_',
  interpolation: {
    escapeValue: false, // not needed for react!!
    prefix: '{{',
    suffix: '}}',
  },
  react: {
    wait: true,
  },
};

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init(config);

if (__DEV__) {
  // Enable access to i18next instance only when working with dev server
  window.i18next = i18n;
}

export default i18n;

i18n.on('languageChanged', (lang) => {
  moment.locale(lang);
});

export async function initializeLocale(userLocale = null) {
  return i18n.services.languageDetector.initializeLocale(window.navigator, userLocale);
}
