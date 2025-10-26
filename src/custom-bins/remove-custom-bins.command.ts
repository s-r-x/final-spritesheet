import { Command } from "@/common/commands/command";
import type { tCustomBin } from "./types";
import { addCustomBinsAtom, removeCustomBinsAtom } from "./custom-bins.atom";

export type tRemoveCustomBinsCommandPayload = {
  bins: tCustomBin[];
};
export class RemoveCustomBinsCommand extends Command<tRemoveCustomBinsCommandPayload> {
  public label = "remove-custom-bins";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(addCustomBinsAtom, this._state.bins);
  }
  protected async _exec() {
    this._atomsStore.set(
      removeCustomBinsAtom,
      this._state.bins.map((bin) => bin.id),
    );
  }
  protected async _persist(): Promise<void> {
    await Promise.all(
      this._state.bins.map((bin) => this._dbMutations.removeCustomBin(bin.id)),
    );
  }
  protected async _undoPersist(): Promise<void> {
    await Promise.all(
      this._state.bins.map((bin) => this._dbMutations.addCustomBin(bin)),
    );
  }
}
