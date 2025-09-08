import { useTranslation } from "./use-translation";

export const useLanguage = (): [
  lang: string,
  changeLang: (lang: string) => any,
] => {
  const { i18n } = useTranslation();
  return [i18n.language, i18n.changeLanguage];
};
