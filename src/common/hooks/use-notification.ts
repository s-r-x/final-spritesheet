import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

export const useNotification = () => {
  const showNotification = useCallback(
    ({
      title,
      message,
      isError,
    }: {
      title?: string;
      message: string;
      isError?: boolean;
    }) => {
      notifications.show({
        title,
        message,
        color: isError ? "red" : undefined,
      });
    },
    [],
  );
  return { showNotification };
};
