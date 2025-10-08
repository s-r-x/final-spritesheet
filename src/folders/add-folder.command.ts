import { Command } from "@/common/commands/command";
import type { tFolder } from "./types";
import { addFoldersAtom, removeFoldersAtom } from "./folders.atom";

export type tAddFolderCommandPayload = {
  folder: tFolder;
};
export class AddFolderCommand extends Command<tAddFolderCommandPayload> {
  public label = "add-folder";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(removeFoldersAtom, this._state.folder.id);
  }
  protected async _exec() {
    this._atomsStore.set(addFoldersAtom, [this._state.folder]);
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.addFolder(this._state.folder);
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.removeFolder(this._state.folder.id);
  }
}
