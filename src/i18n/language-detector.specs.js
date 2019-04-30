import i18n from 'i18next';
import LanguageDetector, {
  getNavigatorLanguages,
  selectLanguage,
  getClosestSupportedLanguage,
} from './language-detector';

describe('i18n/language-detector', () => {
  describe('getNavigatorLanguage', () => {
    it('should throw if navigator is not defined', () => {
      expect(() => getNavigatorLanguages()).toThrow();
    });
    it('should return an array of navigator languages', () => {
      const navigator = {
        languages: ['en-US', 'de-AU', 'en'],
        language: 'de',
        userLanguage: 'de-AU',
      };
      const result = getNavigatorLanguages(navigator);
      expect(result).toEqual(['en-US', 'de-AU', 'en', 'de', 'de-AU']);
    });
    it('should not return empty values', () => {
      expect(
        getNavigatorLanguages({
          languages: undefined,
          language: undefined,
          userLanguage: 'de-AU',
        })
      ).toEqual(['de-AU']);
      expect(
        getNavigatorLanguages({
          languages: ['en'],
          language: undefined,
          userLanguage: undefined,
        })
      ).toEqual(['en']);
    });
  });
  describe('selectLanguage', () => {
    beforeEach(() => {
      i18n.init({
        lngs: ['en-GB'],
        whitelist: ['en-GB'],
      });
    });
    it('should throw if i18nLanguageUtils param is not defined', () => {
      expect(() => selectLanguage()).toThrow();
    });
    it('should throw if languages param is not defined', () => {
      expect(() => selectLanguage(i18n.services.languageUtils)).toThrow();
    });
    it('should return a first whitelisted language from a given array', () => {
      expect(selectLanguage(i18n.services.languageUtils, ['de-DE', 'en-GB'])).toBe('en-GB');
    });
    it('should return null if no supported language found', () => {
      expect(selectLanguage(i18n.services.languageUtils, ['de-DE', 'de'])).toBe(null);
    });
  });
  describe('getClosestSupportedLanguage', () => {
    it('should throw if supportedLanguages param is not defined', () => {
      expect(() => selectLanguage()).toThrow();
    });
    it('should throw if language param is not defined', () => {
      expect(() => selectLanguage(i18n.services.languageUtils)).toThrow();
    });
    it('should return a closest supported language if any', () => {
      expect(getClosestSupportedLanguage(['fr-FR', 'de-DE'], 'de-AU')).toBe('de-DE');
      expect(getClosestSupportedLanguage(['fr-FR', 'de-DE'], 'de')).toBe('de-DE');
    });
    it('should return null if no matching languages found', () => {
      expect(getClosestSupportedLanguage(['fr-FR', 'de-DE'], 'en-GB')).toBe(null);
      expect(getClosestSupportedLanguage(['fr-FR', 'de-DE'], 'en')).toBe(null);
    });
  });
  describe('LanguageDetector', () => {
    beforeEach(() => {
      i18n.init({
        lngs: ['en-GB', 'de-DE'],
        whitelist: ['en-GB', 'de-DE'],
        fallbackLng: 'en-GB',
      });
    });
    it('should have a static prop type with "languageDetector" value', () => {
      expect(LanguageDetector.type).toBe('languageDetector');
    });
    it('should have an async prop with "true" value', () => {
      expect(new LanguageDetector().async).toBe(true);
    });
    it('should have an init method', () => {
      const detector = new LanguageDetector();
      expect(() => detector.init({ languageUtils: {} }, {}, {})).not.toThrow();
    });
    it('should have a detect method', () => {
      const detector = new LanguageDetector();
      expect(() => detector.detect()).not.toThrow();
    });
    it('should call a callback with a user locale if it is passed and supported', () => {
      const navigator = { languages: [] };
      const callback = jest.fn();
      const detector = new LanguageDetector();
      detector.init(i18n.services, {}, i18n.options);
      detector.detect(callback);
      detector.initializeLocale(navigator, 'de-DE');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('de-DE');
    });
    it('should call a callback with a navigator language if userLocale is null', () => {
      const navigator = { languages: ['de-DE'] };
      const callback = jest.fn();
      const detector = new LanguageDetector();
      detector.init(i18n.services, {}, i18n.options);
      detector.detect(callback);
      detector.initializeLocale(navigator, null);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('de-DE');
    });
    it('should call a callback with a navigator language if userLocale is not supported', () => {
      const navigator = { languages: ['de-DE'] };
      const callback = jest.fn();
      const detector = new LanguageDetector();
      detector.init(i18n.services, {}, i18n.options);
      detector.detect(callback);
      detector.initializeLocale(navigator, 'fr-FR');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('de-DE');
    });
    it('should call a callback with a closest to a navigator language if navigator languages are not supported', () => {
      const navigator = { languages: ['de-AU'] };
      const callback = jest.fn();
      const detector = new LanguageDetector();
      detector.init(i18n.services, {}, i18n.options);
      detector.detect(callback);
      detector.initializeLocale(navigator, null);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('de-DE');
    });
  });
  it('should call a callback with a fallback language if no closest language found', () => {
    const navigator = { languages: ['es-MX'] };
    const callback = jest.fn();
    const detector = new LanguageDetector();
    detector.init(i18n.services, {}, i18n.options);
    detector.detect(callback);
    detector.initializeLocale(navigator, null);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('en-GB');
  });
  it('should set locale even if `initializeLocale` was called before `detect`', () => {
    const navigator = { languages: [] };
    const callback = jest.fn();
    const detector = new LanguageDetector();
    detector.init(i18n.services, {}, i18n.options);
    detector.initializeLocale(navigator, 'en-GB');
    detector.detect(callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('en-GB');
  });
});
