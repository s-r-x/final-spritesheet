import type { tDbMutations } from "@/persistence/types";
import { atomsStore } from "../atoms/atoms-store";
import { dbMutationsAtom } from "@/persistence/db.atom";

export type tExecArgs = {
  isRedo?: boolean;
};
export type tUndoArgs = {};
export abstract class Command<TPayload = unknown> {
  private static _id: number = 0;
  public abstract readonly isUndoable: boolean;
  public abstract readonly label: string;
  protected _id: number;
  protected _isExecuted = false;
  protected _isUndone = false;
  protected _isExecPersisted = false;
  protected _isExecPersistedUndone = false;
  protected _atomsStore = atomsStore;
  protected _dbMutations: tDbMutations;

  constructor(protected readonly _state: TPayload) {
    this._id = Command._id++;
    this._dbMutations = atomsStore.get(dbMutationsAtom);
  }

  public get isPersisted(): boolean {
    if (this._isUndone) {
      // the command execution hasn't been persisted, nothing to undo
      if (!this._isExecPersisted) return true;
      return this._isExecPersistedUndone;
    } else if (this._isExecuted) {
      return this._isExecPersisted;
    } else {
      return true;
    }
  }
  public get isUndone(): boolean {
    return this._isUndone;
  }
  public get id(): number {
    return this._id;
  }
  public get payload(): TPayload {
    return this._state;
  }
  public async exec(args: tExecArgs = {}) {
    if (this._isExecuted) {
      console.warn(`command ${this.label} #${this.id} already executed`);
      return;
    }
    await this._exec(args);
    this._isExecPersisted = false;
    this._isUndone = false;
    this._isExecuted = true;
  }
  public async undo(_args: tUndoArgs = {}) {
    if (!this.isUndoable) {
      console.warn(`command ${this.label} #${this.id} is undoable`);
      return;
    }
    if (this._isUndone) {
      console.warn(`command ${this.label} #${this.id} already undone`);
      return;
    }
    await this._undo();
    this._isExecPersistedUndone = false;
    this._isUndone = true;
    this._isExecuted = false;
  }
  public async persist() {
    if (this.isPersisted) {
      console.warn(`command ${this.label} #${this.id} already persisted`);
      return;
    }
    if (this.isUndone) {
      await this._undoPersist();
      this._isExecPersistedUndone = true;
      this._isExecPersisted = false;
    } else {
      await this._persist();
      this._isExecPersisted = true;
      this._isExecPersistedUndone = false;
    }
  }
  protected abstract _exec(args: tExecArgs): Promise<void>;
  protected abstract _undo(): Promise<void>;
  protected abstract _persist(): Promise<void>;
  protected abstract _undoPersist(): Promise<void>;
}
