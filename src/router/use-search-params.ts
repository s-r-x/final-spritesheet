import { useNavigate, useSearch } from "@tanstack/react-router";

type tSearchParams = Record<string, string | undefined>;
export const useSearchParams = (): tSearchParams => {
  return useSearch({ from: "__root__" });
};
export const useSetSearchParams = () => {
  const navigate = useNavigate();
  return (
    params: tSearchParams | ((params: tSearchParams) => tSearchParams),
  ) => {
    navigate({
      to: ".",
      search: params,
    });
  };
};
