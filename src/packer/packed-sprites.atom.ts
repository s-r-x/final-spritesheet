import { atom } from "jotai";
import {
  packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
} from "./settings.atom";
import { spritesAtom } from "@/input/sprites.atom";
import { maxRectsPacker } from "./max-rects.packer";
import { isEmpty } from "#utils/is-empty";
import { itemIdToFolderIdMapAtom } from "@/folders/folders.atom";
import { selectAtom } from "jotai/utils";
import { packerSpriteExcerptFields } from "./config";
import { gridPacker } from "./grid.packer";
import type { tPackerOptions } from "./types";
import { basicPacker } from "./basic.packer";

export const spritesForPackerAtom = selectAtom(
  spritesAtom,
  (sprites) => sprites,
  (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((sprite, i) => {
      for (const field of packerSpriteExcerptFields) {
        if (sprite[field] !== b[i][field]) {
          return false;
        }
      }
      return true;
    });
  },
);
export const packedSpritesAtom = atom((get) => {
  const algorithm = get(packerAlgorithmSettingAtom);
  const size = get(sheetMaxSizeSettingAtom);
  const pot = get(potSettingAtom);
  const allowRotation = get(allowRotationSettingAtom);
  const padding = get(spritePaddingSettingAtom);
  const sprites = get(spritesForPackerAtom);
  const edgeSpacing = get(edgeSpacingSettingAtom);
  const itemIdToFolderIdMap = get(itemIdToFolderIdMapAtom);
  const options: tPackerOptions = {
    sprites,
    size,
    padding,
    edgeSpacing,
    pot,
    allowRotation,
    tags: itemIdToFolderIdMap,
  };
  switch (algorithm) {
    case "maxRects":
      return maxRectsPacker.pack(options);
    case "grid":
      return gridPacker.pack(options);
    case "basic":
      return basicPacker.pack(options);
    default:
      return maxRectsPacker.pack(options);
  }
});
export const hasAnyPackedSpritesAtom = atom((get) => {
  return !isEmpty(get(packedSpritesAtom).bins);
});
