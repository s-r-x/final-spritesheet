import { Command, type tExecArgs } from "@/common/commands/command";
import type { tSprite } from "./types";
import { addSpritesAtom, removeSpritesAtom } from "./sprites.atom";
import { historyEntryToSprite, spriteToPersisted } from "./sprites.mapper";

type tAddSpriteCommandPayload = {
  sprites: tSprite[];
};
export class AddSpritesCommand extends Command<tAddSpriteCommandPayload> {
  public label = "add-sprites";
  public isUndoable = true;
  protected async _exec({ isRedo }: tExecArgs) {
    if (isRedo) {
      const sprites = await Promise.all(
        this._state.sprites.map(historyEntryToSprite),
      );
      this._atomsStore.set(addSpritesAtom, sprites);
    } else {
      this._atomsStore.set(addSpritesAtom, this._state.sprites);
    }
  }
  protected async _undo() {
    this._atomsStore.set(
      removeSpritesAtom,
      this._state.sprites.map((sprite) => sprite.id),
    );
  }
  protected async _persist(): Promise<void> {
    const sprites = this._state.sprites.map(spriteToPersisted);
    await Promise.all(
      sprites.map((sprite) => this._dbMutations.addSprite(sprite)),
    );
  }
  protected async _undoPersist(): Promise<void> {
    await Promise.all(
      this._state.sprites.map((sprite) =>
        this._dbMutations.removeSprite(sprite.id),
      ),
    );
  }
}
