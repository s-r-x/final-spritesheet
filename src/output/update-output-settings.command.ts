import { Command, type tExecArgs } from "@/common/commands/command";
import type { tOutputSettings } from "./types";
import {
  incOutputSettingsFormVersionAtom,
  outputSettingsAtom,
} from "./output-settings.atom";

export type tUpdateOutputSettingsCommandPayload = {
  originalSettings: tOutputSettings;
  settings: Partial<tOutputSettings>;
  projectId: string;
};
export class UpdateOutputSettingsCommand extends Command<tUpdateOutputSettingsCommandPayload> {
  public label = "update-output-settings";
  public isUndoable = true;
  protected async _undo() {
    this._atomsStore.set(outputSettingsAtom, this._state.originalSettings);
    this._atomsStore.set(incOutputSettingsFormVersionAtom);
  }
  protected async _exec({ isRedo }: tExecArgs) {
    this._atomsStore.set(outputSettingsAtom, this._state.settings);
    if (isRedo) {
      this._atomsStore.set(incOutputSettingsFormVersionAtom);
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
