import { atom } from "jotai";
import type { tLogger } from "./types";

export const loggerAtom = atom<Maybe<tLogger>>(null);
