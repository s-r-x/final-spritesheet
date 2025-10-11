import type { tSprite } from "@/input/types";
import { packerSpriteExcerptFields } from "./config";

export type tPackerDependantSpriteField =
  (typeof packerSpriteExcerptFields)[number];

export type tPackerSpriteExcerpt = Pick<tSprite, tPackerDependantSpriteField>;

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

export type tPackerAlgorithm = "grid" | "maxRects";
export type tPackerSettings = {
  packerAlgorithm: tPackerAlgorithm;
  sheetMaxSize: number;
  spritePadding: number;
  edgeSpacing: number;
  pot: boolean;
  allowRotation: boolean;
};
