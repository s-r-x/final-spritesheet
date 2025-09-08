import type { tSprite } from "@/sprites/types";

export type tPackedSprite = tSprite & {
  x: number;
  y: number;
  rotated?: boolean;
  oversized?: boolean;
};
export type tPackedBin = {
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
