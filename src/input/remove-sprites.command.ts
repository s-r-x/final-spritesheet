import { Command } from "@/common/commands/command";
import type { tSprite } from "./types";
import { addSpritesAtom, removeSpritesAtom } from "./sprites.atom";
import { historyEntryToSprite, spriteToPersisted } from "./sprites.mapper";

export type tRemoveSpritesCommandPayload = {
  sprites: tSprite[];
};
export class RemoveSpritesCommand extends Command<tRemoveSpritesCommandPayload> {
  public label = "remove-sprites";
  public isUndoable = true;
  protected async _undo() {
    const sprites = await Promise.all(
      this._state.sprites.map(historyEntryToSprite),
    );
    this._atomsStore.set(addSpritesAtom, sprites);
  }
  protected async _exec() {
    this._atomsStore.set(
      removeSpritesAtom,
      this._state.sprites.map((sprite) => sprite.id),
    );
  }
  protected async _persist(): Promise<void> {
    await Promise.all(
      this._state.sprites.map((sprite) =>
        this._dbMutations.removeSprite(sprite.id),
      ),
    );
  }
  protected async _undoPersist(): Promise<void> {
    const sprites = this._state.sprites.map(spriteToPersisted);
    await Promise.all(
      sprites.map((sprite) => this._dbMutations.addSprite(sprite)),
    );
  }
}
