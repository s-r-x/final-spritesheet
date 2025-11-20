import { DB_NAME } from "#config";
import type { tLogger } from "@/logger/types";
import type {
  tDb,
  tDbBackupFormat,
  tDbImportExport,
  tDbMutations,
  tPersistedBlob,
} from "./types";
import { peakImportFile } from "dexie-export-import";
import { base64ToBlob, blobToBase64 } from "#utils/base64";

export class DbImportExport implements tDbImportExport {
  constructor(
    private _db: tDb,
    private _dbMutations: tDbMutations,
    private _logger: Maybe<tLogger>,
    private _options: { canStoreBlobs: boolean },
  ) {}
  private get _canStoreBlobs(): boolean {
    return this._options.canStoreBlobs ?? true;
  }
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
    await this._db.import(data, {
      noTransaction: true,
      transform: async (
        table,
        value: Omit<tPersistedBlob, "data"> & { data: string },
      ) => {
        if (table === "blobs" && typeof value.data === "string") {
          const persistedDoc: tPersistedBlob = this._canStoreBlobs
            ? {
                ...value,
                isArrayBuffer: false,
                data: await base64ToBlob(value.data),
              }
            : {
                ...value,
                isArrayBuffer: true,
                data: await base64ToBlob(value.data).then((b) =>
                  b.arrayBuffer(),
                ),
              };
          return {
            table,
            value: persistedDoc,
          };
        }
        return { table, value };
      },
    });
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
    const data = await this._db.export({
      noTransaction: true,
      async transform(table, value: tPersistedBlob) {
        if (table === "blobs") {
          return {
            table,
            value: {
              ...value,
              data: await blobToBase64(
                value.isArrayBuffer
                  ? new Blob([value.data], { type: value.mime })
                  : value.data,
              ),
            },
          };
        }
        return { table, value };
      },
    });
    this._logger?.debug({
      layer: "db",
      label: "dbExportCompleted",
    });
    return data;
  }
}
