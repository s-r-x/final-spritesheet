import { DEFAULT_CUSTOM_BIN_ID } from "#config";
import type { tCustomBin } from "./types";

export const isDefaultBin = (bin: string | tCustomBin): boolean => {
  return (typeof bin === "string" ? bin : bin.id) === DEFAULT_CUSTOM_BIN_ID;
};
