import { DB_NAME } from "#config";
import type { tDb, tDbCollections } from "./types";
import Dexie from "dexie";

export const createDb = async (): Promise<tDb> => {
  const db = new Dexie(DB_NAME) as tDb;
  const collections: {
    [K in keyof tDbCollections]: string | null;
  } = {
    sprites: "id, projectId",
    blobs: "id, projectId",
    projects: "id",
  };
  db.version(1).stores(collections);
  await db.open();
  return db;
};
