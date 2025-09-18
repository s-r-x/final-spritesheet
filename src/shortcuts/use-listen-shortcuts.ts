import { useRedo } from "@/history/use-redo";
import { useUndo } from "@/history/use-undo";
import {
  useIsPersisting,
  usePersistChanges,
} from "@/persistence/use-persistence";
import { useHotkeys } from "@mantine/hooks";

export const useListenShortcuts = () => {
  const undo = useUndo();
  const redo = useRedo();
  const persistChanges = usePersistChanges();
  const isPersisting = useIsPersisting();
  useHotkeys(
    isPersisting
      ? []
      : [
          ["ctrl+z", undo],
          ["ctrl+shift+z", redo],
          ["ctrl+s", persistChanges],
        ],
    ["INPUT", "TEXTAREA"],
  );
};
