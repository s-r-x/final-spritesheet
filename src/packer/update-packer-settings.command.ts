import { Command, type tExecArgs } from "@/common/commands/command";
import type { tPackerSettings } from "./types";
import {
  incPackerSettingsFormVersionAtom,
  packerSettingsAtom,
} from "./settings.atom";

export type tUpdatePackerSettingsCommandPayload = {
  originalSettings: tPackerSettings;
  settings: Partial<tPackerSettings>;
  projectId: string;
};
export class UpdatePackerSettingsCommand extends Command<tUpdatePackerSettingsCommandPayload> {
  public label = "update-packer-settings";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(packerSettingsAtom, this._state.originalSettings);
    this._atomsStore.set(incPackerSettingsFormVersionAtom);
  }
  protected async _exec({ isRedo }: tExecArgs) {
    this._atomsStore.set(packerSettingsAtom, this._state.settings);
    if (isRedo) {
      this._atomsStore.set(incPackerSettingsFormVersionAtom);
    }
  }
  protected async _persist(): Promise<void> {
    await this._dbMutations.updateProject(
      this._state.projectId,
      this._state.settings,
    );
  }
  protected async _undoPersist(): Promise<void> {
    await this._dbMutations.updateProject(
      this._state.projectId,
      this._state.originalSettings,
    );
  }
}
