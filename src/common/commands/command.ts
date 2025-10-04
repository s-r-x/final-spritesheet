import type { tDbMutations } from "@/persistence/types";
import { atomsStore } from "../atoms/atoms-store";
import { dbMutationsAtom } from "@/persistence/db.atom";
import { loggerAtom } from "@/logger/logger.atom";
import type { tLogger } from "@/logger/types";

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
  private _logger: Maybe<tLogger>;

  constructor(protected readonly _state: TPayload) {
    this._id = Command._id++;
    this._dbMutations = atomsStore.get(dbMutationsAtom);
    this._logger = atomsStore.get(loggerAtom);
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
      this._logger?.warn({
        layer: "app",
        label: "cmdExecutionSkipped",
        data: `Command ${this.label} #${this.id} is already executed`,
      });
      return;
    }
    await this._exec(args);
    this._isExecPersisted = false;
    this._isUndone = false;
    this._isExecuted = true;
    this._logger?.debug({
      layer: "app",
      label: "cmdExecuted",
      data: {
        label: this.label,
        id: this.id,
        isRedo: !!args.isRedo,
      },
    });
  }
  public async undo(_args: tUndoArgs = {}) {
    if (!this.isUndoable) {
      this._logger?.warn({
        layer: "app",
        label: "cmdUndoSkipped",
        data: `Command ${this.label} #${this.id} is undoable`,
      });
      return;
    }
    if (this._isUndone) {
      this._logger?.warn({
        layer: "app",
        label: "cmdUndoSkipped",
        data: `Command ${this.label} #${this.id} is already undone`,
      });
      return;
    }
    await this._undo();
    this._isExecPersistedUndone = false;
    this._isUndone = true;
    this._isExecuted = false;
    this._logger?.debug({
      layer: "app",
      label: "cmdUndone",
      data: {
        label: this.label,
        id: this.id,
      },
    });
  }
  public async persist() {
    if (this.isPersisted) {
      this._logger?.warn({
        layer: "app",
        label: "cmdUndoPersistenceSkipped",
        data: `Command ${this.label} #${this.id} is already persisted`,
      });
      return;
    }
    if (this.isUndone) {
      this._logger?.debug({
        layer: "app",
        label: "cmdUndoPersistenceStarted",
        data: {
          label: this.label,
          id: this.id,
        },
      });
      await this._undoPersist();
      this._isExecPersistedUndone = true;
      this._isExecPersisted = false;
      this._logger?.debug({
        layer: "app",
        label: "cmdUndoPersisted",
        data: {
          label: this.label,
          id: this.id,
        },
      });
    } else {
      this._logger?.debug({
        layer: "app",
        label: "cmdPersistenceStarted",
        data: { data: { label: this.label, id: this.id } },
      });
      await this._persist();
      this._isExecPersisted = true;
      this._isExecPersistedUndone = false;
      this._logger?.debug({
        layer: "app",
        label: "cmdPersisted",
        data: {
          label: this.label,
          id: this.id,
        },
      });
    }
  }
  protected abstract _exec(args: tExecArgs): Promise<void>;
  protected abstract _undo(): Promise<void>;
  protected abstract _persist(): Promise<void>;
  protected abstract _undoPersist(): Promise<void>;
}
