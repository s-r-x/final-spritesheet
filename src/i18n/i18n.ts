import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resources";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LANGUAGES } from "#config";
import * as z from "zod";
import { en as zodEn, ru as zodRu } from "zod/locales";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.value),
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // order and from where user language should be detected
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
      ],
      // keys or params to lookup language from
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ["localStorage", "cookie"],
      excludeCacheFor: ["cimode"], // languages to not persist (eg. for cimode, or testing)
    },
    react: {
      useSuspense: true, // Enables React.Suspense for translations
    },
  });

const setZodLocale = (lng: string) => {
  switch (lng) {
    case "ru":
      return z.config(zodRu());
    case "en":
      return z.config(zodEn());
    default:
      return z.config(zodEn());
  }
};
setZodLocale(i18n.language);
i18n.on("languageChanged", (lng) => {
  setZodLocale(lng);
});

export default i18n;
