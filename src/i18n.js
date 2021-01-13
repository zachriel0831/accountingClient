import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import index_tw from './i18Locales/tw';
import index_en from './i18Locales/en';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      'en-US': {
        translations: {
          ...index_en
        }
      },
      'zh-TW': {
        translations: {
          ...index_tw
        }
      }
    },
    fallbackLng: 'zh-TW',
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
