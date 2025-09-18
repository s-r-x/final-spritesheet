import { atom } from "jotai";
import { tDbMutations, tDbQueries } from "./types";

export const dbMutationsAtom = atom(null! as tDbMutations);
export const dbQueriesAtom = atom(null! as tDbQueries);
