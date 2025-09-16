import { addRxPlugin, createRxDatabase, RxDocument } from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBAttachmentsPlugin } from "rxdb/plugins/attachments";
import { DEV } from "#config";
import { spriteSchema } from "./sprite.schema";
import type { tDb, tPersistedSprite } from "./types";
import { projectSchema } from "./project.schema";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
import { isNumber } from "#utils/is-number";

addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
if (DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

export const createDb = async (): Promise<tDb> => {
  const storage = getRxStorageDexie();
  const db: tDb = await createRxDatabase({
    name: "final_spritesheet",
    storage: DEV ? wrappedValidateAjvStorage({ storage }) : storage,
  });
  await db.addCollections({
    projects: {
      schema: projectSchema,
    },
    sprites: {
      schema: spriteSchema,
      migrationStrategies: {
        1(doc: RxDocument<tPersistedSprite>) {
          if (!isNumber(doc.scale)) {
            doc.scale = 1;
          }
          return doc;
        },
      },
    },
  });
  return db;
};
