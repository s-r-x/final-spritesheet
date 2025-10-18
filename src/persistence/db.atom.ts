import { atom } from "jotai";
import type { tDbImportExport, tDbMutations, tDbQueries } from "./types";

export const dbMutationsAtom = atom(null! as tDbMutations);
export const dbQueriesAtom = atom(null! as tDbQueries);
export const dbImportExportAtom = atom(null! as tDbImportExport);
