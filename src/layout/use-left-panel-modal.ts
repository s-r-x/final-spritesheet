import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { queryParamBindedModalAtom } from "@/common/atoms/query-param-binded-modal-atom";

export const useLeftPanelModal = () => {
  const setValue = useSetAtom(leftPanelModalVisibilityAtom);
  return useCallback(() => {
    setValue(true);
  }, [setValue]);
};
export const useCloseLeftPanelModal = () => {
  const setId = useSetAtom(leftPanelModalVisibilityAtom);
  return useCallback(() => {
    setId(false);
  }, [setId]);
};

export const useLeftPanelModalVisibilityState = (): boolean => {
  const isVisible = useAtomValue(leftPanelModalVisibilityAtom);
  return isVisible;
};

const QUERY_PARAMS_KEY = "left_panel";
const leftPanelModalVisibilityAtom = queryParamBindedModalAtom({
  key: QUERY_PARAMS_KEY,
});
