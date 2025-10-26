import { Command } from "@/common/commands/command";
import type { tCustomBin } from "./types";
import { addCustomBinsAtom, removeCustomBinsAtom } from "./custom-bins.atom";

export type tAddCustomBinCommandPayload = {
  bin: tCustomBin;
};
export class AddCustomBinCommand extends Command<tAddCustomBinCommandPayload> {
  public label = "add-custom-bin";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(removeCustomBinsAtom, this._state.bin.id);
  }
  protected async _exec() {
    this._atomsStore.set(addCustomBinsAtom, [this._state.bin]);
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.addCustomBin(this._state.bin);
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.removeCustomBin(this._state.bin.id);
  }
}
