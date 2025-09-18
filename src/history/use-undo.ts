import { useAtomValue } from "jotai";
import { canUndoAtom } from "./history.atom";
import { useHistoryManager } from "./use-history-manager";
import { useCallback } from "react";

export const useUndo = () => {
  const historyManager = useHistoryManager();
  return useCallback(() => {
    return historyManager.undo();
  }, [historyManager]);
};

export const useCanUndo = () => useAtomValue(canUndoAtom);
