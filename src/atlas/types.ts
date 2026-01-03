import type { tSpritesMap } from "@/input/types";
import type { tPackedSprite } from "@/packer/types";

export type tGenerateAtlasFileArgs = {
  baseFileName: string;
  fileNamePostfix?: string;
  packedSprites: tPackedSprite[];
  spritesMap: tSpritesMap;
  animations?: Record<string, string[]>;
  textureWidth: number;
  textureHeight: number;
  textureAtlasFilename: string;
  pixelFormat?: string;
  pixiGenTs?: boolean;
};

export type tGenerateAtlasFileResultEntry = {
  fileName: string;
  content: string;
};
export type tGenerateAtlasFileOutput = {
  entries: tGenerateAtlasFileResultEntry[];
};

export type tPixiAtlasFrame = {
  frame: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  trimmed: boolean;
  rotated?: boolean;
};
export type tPixiAtlas = {
  animations?: Record<string, string[]>;
  frames: Record<string, tPixiAtlasFrame>;
  meta: {
    format?: string;
    scale: string;
    image: string;
    size: { w: number; h: number };
  };
};
