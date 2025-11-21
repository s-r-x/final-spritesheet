import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";
import { useCustomBinsList } from "./use-custom-bins";

const QUERY_PARAMS_KEY = "editable_bin";
export const useOpenCustomBinEditor = () => {
  const setParams = useSetSearchParams();
  return (id: string) => {
    setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: id }));
  };
};
export const useCloseCustomBinEditor = () => {
  return useGoBack();
};

export const useEditableCustomBin = () => {
  const searchParams = useSearchParams();
  const id = searchParams[QUERY_PARAMS_KEY];
  const binsList = useCustomBinsList();
  if (!id) return null;
  if (id === "new") return "new";
  return binsList.find((f) => f.id === id) || null;
};
