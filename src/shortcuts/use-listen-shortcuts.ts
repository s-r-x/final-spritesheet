import { useMutation } from "@/common/hooks/use-mutation";
import { useRedo } from "@/history/use-redo";
import { useUndo } from "@/history/use-undo";
import {
  useIsPersisting,
  usePersistChanges,
} from "@/persistence/use-persistence";
import { useHotkeys } from "@mantine/hooks";

export const useListenShortcuts = () => {
  const undo = useUndo();
  const undoMut = useMutation(undo);
  const redo = useRedo();
  const redoMut = useMutation(redo);
  const persistChanges = usePersistChanges();
  const persistChangesMut = useMutation(persistChanges, {
    showLoadingBar: true,
  });
  const isPersisting = useIsPersisting();
  useHotkeys(
    isPersisting
      ? []
      : [
          ["ctrl+z", () => undoMut.mutate()],
          ["ctrl+shift+z", () => redoMut.mutate()],
          ["ctrl+s", () => persistChangesMut.mutate()],
        ],
    ["INPUT", "TEXTAREA"],
  );
};
