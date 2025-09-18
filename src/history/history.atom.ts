import { atom } from "jotai";
import { isEmpty } from "#utils/is-empty";
import type { Command } from "@/common/commands/command";

const undoStackAtom = atom<Command[]>([]);
const redoStackAtom = atom<Command[]>([]);

export const canUndoAtom = atom((get) => !isEmpty(get(undoStackAtom)));
export const canRedoAtom = atom((get) => !isEmpty(get(redoStackAtom)));

export const resetHistoryStackAtom = atom(null, (_get, set) => {
  set(undoStackAtom, []);
  set(redoStackAtom, []);
});
export const addCmdAtom = atom(null, (get, set, cmd: Command) => {
  set(undoStackAtom, get(undoStackAtom).concat(cmd));
  set(redoStackAtom, []);
});

export const undoAtom = atom(null, (get, set): Maybe<Command> => {
  if (!get(canUndoAtom)) return null;
  const undoStack = [...get(undoStackAtom)];
  const cmd = undoStack.pop();
  if (!cmd) return null;
  const redoStack = get(redoStackAtom);
  set(undoStackAtom, undoStack);
  set(redoStackAtom, redoStack.concat(cmd));
  return cmd;
});

export const redoAtom = atom(null, (get, set): Maybe<Command> => {
  if (!get(canRedoAtom)) return null;
  const redoStack = [...get(redoStackAtom)];
  const cmd = redoStack.pop();
  if (!cmd) return null;
  const undoStack = get(undoStackAtom);
  set(redoStackAtom, redoStack);
  set(undoStackAtom, undoStack.concat(cmd));
  return cmd;
});
