import { Command } from "@/common/commands/command";
import type { tSprite, tUpdateSpriteData } from "./types";
import { updateSpriteAtom } from "./sprites.atom";
import { pick } from "#utils/pick";

export type tUpdateSpriteCommandPayload = {
  originalSprite: tSprite;
  updates: tUpdateSpriteData;
};
export class UpdateSpriteCommand extends Command<tUpdateSpriteCommandPayload> {
  public label = "update-sprite";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(
      updateSpriteAtom,
      this._state.originalSprite.id,
      this.extractSpriteOriginalData(),
    );
  }
  protected async _exec() {
    this._atomsStore.set(
      updateSpriteAtom,
      this._state.originalSprite.id,
      this._state.updates,
    );
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.updateSprite(
      this._state.originalSprite.id,
      this._state.updates,
    );
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.updateSprite(
      this._state.originalSprite.id,
      this.extractSpriteOriginalData(),
    );
  }
  private extractSpriteOriginalData() {
    const updates = pick(
      this._state.originalSprite,
      Object.keys(this._state.updates) as (keyof tUpdateSpriteData)[],
    );
    return updates;
  }
}
