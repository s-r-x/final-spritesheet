import { createDb } from "./db";
import { DbImportExport } from "./import-export";
import { DbMutations } from "./mutations";
import { DbQueries } from "./queries";

export const initPersistenceLayer = async () => {
  const db = await createDb();
  const mutations = new DbMutations(db);
  const queries = new DbQueries(db);
  const importExport = new DbImportExport(db, mutations);
  return { mutations, queries, importExport };
};
