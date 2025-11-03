import path from "node:path";

export const ASSETS_FOLDER = path.join(import.meta.dirname, "..", "assets");
export const normalizeAssetName = (name: string): string => {
  return path.join(ASSETS_FOLDER, name);
};
