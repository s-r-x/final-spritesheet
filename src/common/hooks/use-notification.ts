import { notifications } from "@mantine/notifications";

export const useNotification = () => {
  const showNotification = ({
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
  };
  return { showNotification };
};
