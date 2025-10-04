import { DB_NAME } from "#config";
import type { tLogger } from "@/logger/types";
import type {
  tDb,
  tDbBackupFormat,
  tDbImportExport,
  tDbMutations,
} from "./types";
import { exportDB, importInto, peakImportFile } from "dexie-export-import";

export class DbImportExport implements tDbImportExport {
  constructor(
    private _db: tDb,
    private _dbMutations: tDbMutations,
    private _logger: Maybe<tLogger>,
  ) {}
  public async importDb(data: tDbBackupFormat): Promise<void> {
    this._logger?.debug({
      layer: "db",
      label: "dbImportStarted",
    });
    const metadata = await peakImportFile(data);
    if (metadata.formatName !== "dexie") {
      throw new Error("Bad backup format");
    }
    if (metadata.data.databaseName !== DB_NAME) {
      throw new Error("Wrong database");
    }
    await this._dbMutations.clearDatabase();
    // TODO:: maybe it's a good idea to create a backup for the current db and restore if there were any errors
    await importInto(this._db, data);
    this._logger?.debug({
      layer: "db",
      label: "dbImportCompleted",
    });
  }
  public async exportDb(): Promise<tDbBackupFormat> {
    this._logger?.debug({
      layer: "db",
      label: "dbExportStarted",
    });
    const data = await exportDB(this._db);
    this._logger?.debug({
      layer: "db",
      label: "dbExportCompleted",
    });
    return data;
  }
}
