import path from "node:path";

export const ASSETS_FOLDER = path.join(
  import.meta.dirname,
  "..",
  "test-textures",
);
export const normalizeTestTextureName = (name: string): string => {
  return path.join(ASSETS_FOLDER, name);
};
