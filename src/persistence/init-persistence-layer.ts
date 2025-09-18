import { createDb } from "./db";
import { DbMutations } from "./mutations";
import { DbQueries } from "./queries";

export const initPersistenceLayer = async () => {
  const db = await createDb();
  const mutations = new DbMutations(db);
  const queries = new DbQueries(db);
  return { mutations, queries };
};
