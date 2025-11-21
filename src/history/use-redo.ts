import { useAtomValue } from "jotai";
import { canRedoAtom } from "./history.atom";
import { useHistoryManager } from "./use-history-manager";

export const useRedo = () => {
  const historyManager = useHistoryManager();
  return () => historyManager.redo();
};

export const useCanRedo = () => useAtomValue(canRedoAtom);
