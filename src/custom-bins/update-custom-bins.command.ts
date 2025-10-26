import { Command } from "@/common/commands/command";
import type {
  tCustomBin,
  tUpdateCustomBinData,
  tUpdateCustomBinsArg,
} from "./types";
import { updateCustomBinsAtom } from "./custom-bins.atom";
import { pick } from "#utils/pick";

export type tUpdateCustomBinsCommandPayload = {
  data: tUpdateCustomBinsArg;
};
export class UpdateCustomBinsCommand extends Command<tUpdateCustomBinsCommandPayload> {
  public label = "update-custom-bins";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(
      updateCustomBinsAtom,
      Object.values(this._state.data).reduce(
        (acc, d) => {
          acc[d.bin.id] = {
            data: this._extractBinOriginalData(d.bin, d.data),
          };
          return acc;
        },
        {} as Record<string, { data: tUpdateCustomBinData }>,
      ),
    );
  }
  protected async _exec() {
    this._atomsStore.set(updateCustomBinsAtom, this._state.data);
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.updateCustomBins(
      Object.values(this._state.data).map((d) => ({
        id: d.bin.id,
        data: d.data,
      })),
    );
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.updateCustomBins(
      Object.values(this._state.data).map((d) => ({
        id: d.bin.id,
        data: this._extractBinOriginalData(d.bin, d.data),
      })),
    );
  }
  protected _extractBinOriginalData(
    bin: tCustomBin,
    updates: tUpdateCustomBinData,
  ) {
    const originalData = pick(
      bin,
      Object.keys(updates) as (keyof tUpdateCustomBinData)[],
    );
    return originalData;
  }
}
