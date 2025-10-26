import type { tPersistedCustomBin } from "@/persistence/types";
import type { tCustomBin } from "./types";

export const persistedToCustomBin = (bin: tPersistedCustomBin): tCustomBin =>
  bin;
