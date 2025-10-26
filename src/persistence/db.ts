import { DB_NAME } from "#config";
import type { tLogger } from "@/logger/types";
import type { tDb, tDbCollections } from "./types";
import Dexie from "dexie";

export const createDb = async ({
  logger,
}: {
  logger?: tLogger;
} = {}): Promise<tDb> => {
  const db = new Dexie(DB_NAME) as tDb;
  const collections: {
    [K in keyof tDbCollections]: string | null;
  } = {
    sprites: "id, projectId",
    blobs: "id, projectId",
    projects: "id",
    folders: "id, projectId",
    customBins: "id, projectId",
  };
  db.version(1).stores(collections);
  await db.open();
  logger?.info({
    layer: "db",
    label: "connectionOpened",
    data: { db },
  });
  return db;
};
