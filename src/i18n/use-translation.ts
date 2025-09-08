import { useTranslation as useBaseTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useBaseTranslation();
  return { t, i18n };
};
