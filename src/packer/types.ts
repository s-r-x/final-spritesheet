import type { tSprite } from "@/input/types";
import { packerSpriteExcerptFields } from "./config";

export type tPackerDependantSpriteField =
  (typeof packerSpriteExcerptFields)[number];

export type tPackerSpriteExcerpt = Pick<tSprite, tPackerDependantSpriteField>;

export type tRawPackedSprite = tPackerSpriteExcerpt & {
  x: number;
  y: number;
  rotated?: boolean;
  oversized?: boolean;
};
export type tPackedSprite = tRawPackedSprite & tSprite;
export type tRawPackedBin = {
  sprites: tRawPackedSprite[];
  maxWidth: number;
  maxHeight: number;
  width: number;
  height: number;
};
export type tPackedBin = Omit<tRawPackedBin, "sprites"> & {
  sprites: tPackedSprite[];
};

export type tPackerAlgorithm = "grid" | "maxRects";
export type tPackerSettings = {
  packerAlgorithm: tPackerAlgorithm;
  sheetMaxSize: number;
  spritePadding: number;
  edgeSpacing: number;
  pot: boolean;
  allowRotation: boolean;
};
