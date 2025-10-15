import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../src/i18n/resources/en.json" with { type: "json" };

i18n.use(initReactI18next).init({
  initAsync: false,
  lng: "en",
  fallbackLng: "en",
  resources: { en },
  interpolation: {
    escapeValue: false,
  },
});

const t = i18n.t.bind(i18n);
export { t };
