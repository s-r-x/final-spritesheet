import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export const useGoBack = () => {
  const router = useRouter();
  return useCallback(() => {
    return router.history.back();
  }, [router]);
};
