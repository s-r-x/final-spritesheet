import { useAtomValue } from "jotai";
import { canUndoAtom } from "./history.atom";
import { useHistoryManager } from "./use-history-manager";

export const useUndo = () => {
  const historyManager = useHistoryManager();
  return () => historyManager.undo();
};

export const useCanUndo = () => useAtomValue(canUndoAtom);
