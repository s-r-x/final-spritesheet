import type { tPackedSprite } from "@/packer/types";

export type tGenerateAtlasFileArgs = {
  sprites: tPackedSprite[];
  textureWidth: number;
  textureHeight: number;
  textureAtlasFilename: string;
};
