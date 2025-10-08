import { Command } from "@/common/commands/command";
import type { tFolder, tUpdateFolderData, tUpdateFoldersArg } from "./types";
import { updateFoldersAtom } from "./folders.atom";
import { pick } from "#utils/pick";

export type tUpdateFolderCommandPayload = {
  data: tUpdateFoldersArg;
};
export class UpdateFoldersCommand extends Command<tUpdateFolderCommandPayload> {
  public label = "update-folders";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(
      updateFoldersAtom,
      Object.values(this._state.data).reduce(
        (acc, d) => {
          acc[d.folder.id] = {
            data: this._extractFolderOriginalData(d.folder, d.data),
          };
          return acc;
        },
        {} as Record<string, { data: tUpdateFolderData }>,
      ),
    );
  }
  protected async _exec() {
    this._atomsStore.set(updateFoldersAtom, this._state.data);
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.updateFolders(
      Object.values(this._state.data).map((d) => ({
        id: d.folder.id,
        data: d.data,
      })),
    );
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.updateFolders(
      Object.values(this._state.data).map((d) => ({
        id: d.folder.id,
        data: this._extractFolderOriginalData(d.folder, d.data),
      })),
    );
  }
  protected _extractFolderOriginalData(
    folder: tFolder,
    updates: tUpdateFolderData,
  ) {
    const originalData = pick(
      folder,
      Object.keys(updates) as (keyof tUpdateFolderData)[],
    );
    return originalData;
  }
}
