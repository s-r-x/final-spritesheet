import { Command } from "@/common/commands/command";
import type { tFolder } from "./types";
import { addFoldersAtom, removeFoldersAtom } from "./folders.atom";

export type tRemoveFoldersCommandPayload = {
  folders: tFolder[];
};
export class RemoveFoldersCommand extends Command<tRemoveFoldersCommandPayload> {
  public label = "remove-folders";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(addFoldersAtom, this._state.folders);
  }
  protected async _exec() {
    this._atomsStore.set(
      removeFoldersAtom,
      this._state.folders.map((folder) => folder.id),
    );
  }
  protected async _persist(): Promise<void> {
    await Promise.all(
      this._state.folders.map((folder) =>
        this._dbMutations.removeFolder(folder.id),
      ),
    );
  }
  protected async _undoPersist(): Promise<void> {
    await Promise.all(
      this._state.folders.map((folder) => this._dbMutations.addFolder(folder)),
    );
  }
}
