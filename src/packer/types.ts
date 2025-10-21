import type { tSprite } from "@/input/types";
import type { packerSpriteExcerptFields } from "./config";
import type { tPackerAlgorithm } from "#config";

export type { tPackerAlgorithm };
export type tPackerSpriteExcerptField =
  (typeof packerSpriteExcerptFields)[number];

export type tPackerSpriteExcerpt = Pick<tSprite, tPackerSpriteExcerptField>;

export type tPackedSprite = {
  id: string;
  x: number;
  y: number;
  rotated?: boolean;
  oversized?: boolean;
};
export type tPackedBin = {
  tag?: string;
  sprites: tPackedSprite[];
  maxWidth: number;
  maxHeight: number;
  width: number;
  height: number;
};

export type tPackerSettings = {
  packerAlgorithm: tPackerAlgorithm;
  sheetMaxSize: number;
  spritePadding: number;
  edgeSpacing: number;
  pot: boolean;
  allowRotation: boolean;
};

export type tPackerOptions = {
  sprites: tPackerSpriteExcerpt[];
  size: number;
  padding?: number;
  edgeSpacing?: number;
  pot?: boolean;
  allowRotation?: boolean;
  tags?: Record<string, string>;
};
export type tPackerReturnValue = {
  bins: tPackedBin[];
  oversizedSprites: string[];
};
export type tPacker = {
  pack: (options: tPackerOptions) => tPackerReturnValue;
};
