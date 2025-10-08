import { atom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";
import type { tContextMenuState, tOpenContextMenuArgs } from "./types";

export const contextMenuStateAtom = atomWithReset<tContextMenuState>({
  isOpen: false,
  anchorPoint: { x: 0, y: 0 },
  items: [],
});

export const closeContextMenuAtom = atom(null, (_get, set) =>
  set(contextMenuStateAtom, RESET),
);
export const openContextMenuAtom = atom(
  null,
  (_get, set, { event, ...rest }: tOpenContextMenuArgs) => {
    event.preventDefault();
    set(contextMenuStateAtom, {
      isOpen: true,
      anchorPoint: {
        x: event.clientX,
        y: event.clientY,
      },
      ...rest,
    });
  },
);
