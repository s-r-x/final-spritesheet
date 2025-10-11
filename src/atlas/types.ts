import type { tSpritesMap } from "@/input/types";
import type { tPackedSprite } from "@/packer/types";

export type tGenerateAtlasFileArgs = {
  baseFileName: string;
  fileNamePostfix?: string;
  packedSprites: tPackedSprite[];
  spritesMap: tSpritesMap;
  textureWidth: number;
  textureHeight: number;
  textureAtlasFilename: string;
};

export type tGenerateAtlasFileResultEntry = {
  fileName: string;
  content: string;
};
export type tGenerateAtlasFileOutput = {
  entries: tGenerateAtlasFileResultEntry[];
};
