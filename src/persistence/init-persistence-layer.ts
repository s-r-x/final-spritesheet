import type { tLogger } from "@/logger/types";
import { createDb } from "./db";
import { DbImportExport } from "./import-export";
import { DbMutations } from "./mutations";
import { DbQueries } from "./queries";
import type { tDb } from "./types";

export const initPersistenceLayer = async ({ logger }: { logger: tLogger }) => {
  const db = await createDb({ logger });
  const canStoreBlobs = await detectBlobSupport(db);
  if (canStoreBlobs) {
    logger?.info({ layer: "db", label: "blobStorageSupported" });
  } else {
    logger?.warn({ layer: "db", label: "blobStorageUnsupported" });
  }
  const mutations = new DbMutations(db, logger, { canStoreBlobs });
  const queries = new DbQueries(db, logger);
  const importExport = new DbImportExport(db, mutations, logger, {
    canStoreBlobs,
  });
  return { mutations, queries, importExport };
};

async function detectBlobSupport(db: tDb): Promise<boolean> {
  let isSupported: boolean = true;
  const cacheKey = "can-store-blobs";
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return cached === "1";
  }
  try {
    const testBlob = new Blob(["a"], { type: "text/plain" });
    const id = "test-blob";
    await db.transaction("rw", db.blobs, async () => {
      await db.blobs.add({
        id,
        projectId: "",
        data: testBlob,
        mime: testBlob.type,
      });
    });

    await db.blobs.delete(id);
    isSupported = true;
  } catch (e) {
    const isWebKitError =
      e instanceof Error &&
      e.message &&
      (e.message.toLowerCase().includes("error preparing blob") ||
        e.name === "DataCloneError");
    if (!isWebKitError) {
      console.error(e);
    }
    isSupported = false;
  }
  localStorage.setItem(cacheKey, isSupported ? "1" : "0");
  return isSupported;
}
