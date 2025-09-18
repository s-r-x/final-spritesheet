import { useAtomValue } from "jotai";
import { dbMutationsAtom } from "./db.atom";

export const useDbMutations = () => {
  return useAtomValue(dbMutationsAtom);
};
