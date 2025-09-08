import { useMediaQuery } from "@mantine/hooks";

export const useIsMobileLayout = (): boolean => {
  return useMediaQuery("(max-width: 62em)");
};
