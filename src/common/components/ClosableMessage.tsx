import { useTranslation } from "@/i18n/use-translation";
import { Alert } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type { ReactNode } from "react";

type tProps = {
  id: string;
  content: any;
  icon?: ReactNode;
  title?: string;
};
const DOMAIN = "closeable_msg::";
const CloseableMessage = (props: tProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useLocalStorage<"0" | "1">({
    key: DOMAIN + props.id,
    defaultValue: "1",
  });
  if (value === "0") return null;
  return (
    <Alert
      title={props.title}
      icon={props.icon}
      withCloseButton
      onClose={() => setValue("0")}
      closeButtonLabel={t("close")}
    >
      {props.content}
    </Alert>
  );
};

export default CloseableMessage;
