import type { tLogger } from "@/logger/types";
import { createDb } from "./db";
import { DbImportExport } from "./import-export";
import { DbMutations } from "./mutations";
import { DbQueries } from "./queries";

export const initPersistenceLayer = async ({ logger }: { logger: tLogger }) => {
  const db = await createDb({ logger });
  const mutations = new DbMutations(db, logger);
  const queries = new DbQueries(db, logger);
  const importExport = new DbImportExport(db, mutations, logger);
  return { mutations, queries, importExport };
};
