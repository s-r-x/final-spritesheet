import { useAtomValue, useSetAtom } from "jotai";
import { contextMenuStateAtom, openContextMenuAtom } from "./context-menu.atom";
import { useResetAtom } from "jotai/utils";

export const useContextMenuState = () => {
  return useAtomValue(contextMenuStateAtom);
};
export const useContextMenu = () => {
  const openContextMenu = useSetAtom(openContextMenuAtom);
  return {
    openContextMenu,
  };
};
export const useCloseContextMenu = () => {
  const reset = useResetAtom(contextMenuStateAtom);
  return reset;
};
