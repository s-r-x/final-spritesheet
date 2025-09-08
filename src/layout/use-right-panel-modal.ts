import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { queryParamBindedModalAtom } from "@/common/atoms/query-param-binded-modal-atom";

export const useRightPanelModal = () => {
  const setValue = useSetAtom(rightPanelModalVisibilityAtom);
  return useCallback(() => {
    setValue(true);
  }, [setValue]);
};
export const useCloseRightPanelModal = () => {
  const setId = useSetAtom(rightPanelModalVisibilityAtom);
  return useCallback(() => {
    setId(false);
  }, [setId]);
};

export const useRightPanelModalVisibilityState = (): boolean => {
  const isVisible = useAtomValue(rightPanelModalVisibilityAtom);
  return isVisible;
};

const QUERY_PARAMS_KEY = "right_panel";
const rightPanelModalVisibilityAtom = queryParamBindedModalAtom({
  key: QUERY_PARAMS_KEY,
});
