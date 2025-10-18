import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

type tSearchParams = Record<string, string | undefined>;
export const useSearchParams = (): tSearchParams => {
  return useSearch({ from: "__root__" });
};
export const useSetSearchParams = () => {
  const navigate = useNavigate();
  return useCallback(
    (params: tSearchParams | ((params: tSearchParams) => tSearchParams)) => {
      navigate({
        to: ".",
        search: params,
      });
    },
    [navigate],
  );
};
