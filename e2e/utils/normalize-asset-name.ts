import path from "node:path";

export const normalizeAssetName = (name: string): string => {
  return path.join(import.meta.dirname, "..", "assets", name);
};
