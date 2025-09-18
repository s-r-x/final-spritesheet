import { useAtomValue } from "jotai";
import { canRedoAtom } from "./history.atom";
import { useHistoryManager } from "./use-history-manager";
import { useCallback } from "react";

export const useRedo = () => {
  const historyManager = useHistoryManager();
  return useCallback(() => {
    return historyManager.redo();
  }, [historyManager]);
};

export const useCanRedo = () => useAtomValue(canRedoAtom);
