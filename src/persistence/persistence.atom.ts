import type { Command } from "@/common/commands/command";
import { atom } from "jotai";
import { isEmpty } from "#utils/is-empty";
import { unique } from "#utils/unique";

export const persistenceCommandsAtom = atom<Command[]>([]);

export const isPersistingAtom = atom(false);
export const hasPersistenceCommandsAtom = atom(
  (get) => !isEmpty(get(persistenceCommandsAtom)),
);

export const addPersistenceCommandAtom = atom(
  null,
  (get, set, cmd: Command) => {
    const cmds = get(persistenceCommandsAtom);
    const newCmds = unique(cmds.concat(cmd), (cmd) => cmd.id);
    set(persistenceCommandsAtom, newCmds);
  },
);
export const clearPersistenceCommandsAtom = atom(null, (_get, set) => {
  set(persistenceCommandsAtom, []);
});
