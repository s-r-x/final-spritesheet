import { useTranslation } from "@/i18n/use-translation";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export class ConfirmError extends Error {
  constructor(message?: any) {
    super(message);
    this.name = "ConfirmError";
  }
}

const i18nNs = "confirm_dialog.";
export const useConfirm = () => {
  const { t } = useTranslation();
  const confirm = ({
    title,
    message,
    yesText,
    noText,
  }: {
    title?: string;
    message?: string;
    yesText?: string;
    noText?: string;
  }) => {
    return new Promise<void>((res, rej) => {
      modals.openConfirmModal({
        title: title || t(i18nNs + "default_title"),
        children: message ? <Text size="sm">{message}</Text> : null,
        labels: {
          confirm: yesText || t(i18nNs + "default_yes"),
          cancel: noText || t(i18nNs + "default_no"),
        },
        onCancel: () => rej(new ConfirmError()),
        onClose: () => rej(new ConfirmError()),
        onConfirm: res,
      });
    });
  };
  return { confirm };
};
