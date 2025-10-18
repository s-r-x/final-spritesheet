import { useCallback } from "react";
import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";

const QUERY_PARAMS_KEY = "right_panel";
const OPENED_VALUE = "y";
export const useRightPanelModal = () => {
  const setParams = useSetSearchParams();
  return useCallback(() => {
    setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: OPENED_VALUE }));
  }, [setParams]);
};
export const useCloseRightPanelModal = () => {
  return useGoBack();
};

export const useRightPanelModalVisibilityState = (): boolean => {
  const params = useSearchParams();
  return params[QUERY_PARAMS_KEY] === OPENED_VALUE;
};
