import { atomsStore } from "@/common/atoms/atoms-store";
import { Command } from "@/common/commands/command";
import { addCmdAtom, redoAtom, undoAtom } from "./history.atom";
import { Mutex } from "#utils/mutex";
import { addPersistenceCommandAtom } from "@/persistence/persistence.atom";

export class HistoryManager {
  private static _instance: HistoryManager;
  private _mutex = new Mutex();
  public static get instance(): HistoryManager {
    if (!HistoryManager._instance) {
      HistoryManager._instance = new HistoryManager();
    }
    return HistoryManager._instance;
  }
  public async undo() {
    const cmd = atomsStore.set(undoAtom);
    if (!cmd) return;
    const cmds = this._commandToArray(cmd);
    for (const cmd of cmds) {
      if (cmd.isUndoable) {
        await this._mutex.run(async () => {
          await cmd.undo();
          await this._persistCommand(cmd);
        });
      }
    }
  }
  public async redo() {
    const cmd = atomsStore.set(redoAtom);
    if (!cmd) return;
    const cmds = this._commandToArray(cmd);
    for (const cmd of cmds) {
      await this._mutex.run(async () => {
        await cmd.exec({ isRedo: true });
        await this._persistCommand(cmd);
      });
    }
  }
  public async execCommand(cmd: Command | Command[]) {
    atomsStore.set(addCmdAtom, cmd);
    const cmds = this._commandToArray(cmd);
    for (const cmd of cmds) {
      await this._mutex.run(async () => {
        await cmd.exec();
        await this._persistCommand(cmd);
      });
    }
  }
  private async _persistCommand(cmd: Command) {
    atomsStore.set(addPersistenceCommandAtom, cmd);
  }
  private _commandToArray(cmd: Command | Command[]): Command[] {
    return Array.isArray(cmd) ? cmd : [cmd];
  }
}
