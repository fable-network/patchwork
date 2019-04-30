import noop from 'lodash/noop';
import qs from 'qs';

export function getNavigatorLanguages(navigator) {
  if (!navigator) {
    throw new Error('"navigator" parameter is not defined');
  }
  return [...(navigator.languages || []), navigator.language, navigator.userLanguage].filter(
    Boolean
  );
}

export function selectLanguage(i18nLanguageUtils, languages) {
  if (!i18nLanguageUtils) {
    throw new Error('"i18nLanguageUtils" param is not defined');
  }
  if (!languages) {
    throw new Error('"languages" param is not defined');
  }
  const selected =
    languages.find((language) => {
      if (!language) return false;
      const cleanedLang = i18nLanguageUtils.formatLanguageCode(language);
      return i18nLanguageUtils.isWhitelisted(cleanedLang);
    }) || null;
  return selected;
}

export function getClosestSupportedLanguage(supportedLanguages, language) {
  if (!supportedLanguages) {
    throw new Error('"supportedLanguages" param is not defined');
  }
  if (!language) {
    throw new Error('"language" param is not defined');
  }
  const languageWithoutCountry = `${language.split('-')[0]}-`;
  return (
    supportedLanguages.find((supportedLanguage) =>
      supportedLanguage.startsWith(languageWithoutCountry)
    ) || null
  );
}

export default class LanguageDetector {
  // Tell `i18next` that this is a language detection module
  static type = 'languageDetector';
  // Tell `i18next` that this is an async language detector
  async = true;
  onDetect = noop;

  init = (services, _detectionOptions, options) => {
    this.options = options;
    this.selectLanguage = selectLanguage.bind(null, services.languageUtils);
    this.getClosestSupportedLanguage = getClosestSupportedLanguage.bind(null, options.lngs);
  };

  detect = (callback) => {
    // `i18next` provides a set language callback to async language detectors
    this.detectionCallback = callback;
    // Always call `onDetect`. It can be overwritten in `initializeLocale`
    this.onDetect();
  };

  initializeLocale = async (navigator, userLocale) => {
    if (!this.detectionCallback) {
      // If `detect` hasn't been called yet, save current method call for later
      this.onDetect = this.initializeLocale.bind(this, navigator, userLocale);
      return userLocale;
    }
    const localeQueryParam = qs.parse(window.location.search.replace('?', '')).locale;
    const useLocaleQueryParam = this.options.useLocaleQueryParam && localeQueryParam;
    // Run `userLocale` through `selectLangauge` to ensure it's supported
    let locale = this.selectLanguage([useLocaleQueryParam ? localeQueryParam : userLocale]);
    if (!locale) {
      const navigatorLanguages = getNavigatorLanguages(navigator);
      const fallback =
        (this.options.fallbackLng && this.options.fallbackLng[0]) || this.options.fallbackLng;
      locale =
        this.selectLanguage(navigatorLanguages) ||
        this.selectLanguage(navigatorLanguages.map(this.getClosestSupportedLanguage)) ||
        fallback;
    }
    this.detectionCallback(locale);
    return locale;
  };

  cacheUserLanguage = noop;
}
