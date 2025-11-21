import { useRouter } from "@tanstack/react-router";

export const useGoBack = () => {
  const router = useRouter();
  return () => router.history.back();
};
