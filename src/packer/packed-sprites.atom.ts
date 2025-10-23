import { atom } from "jotai";
import {
  packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
  multipackSettingAtom,
} from "./settings.atom";
import { spritesAtom } from "@/input/sprites.atom";
import { isEmpty } from "#utils/is-empty";
import { itemIdToFolderIdMapAtom } from "@/folders/folders.atom";
import { selectAtom } from "jotai/utils";
import { packerSpriteExcerptFields } from "./config";
import type {
  tPacker,
  tPackerAlgorithm,
  tPackerOptions,
  tPackerReturnValue,
} from "./types";
import { maxRectsPacker } from "./max-rects.packer";
import { gridPacker } from "./grid.packer";
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
export const packedSpritesAtom = atom((get): tPackerReturnValue => {
  const algorithm = get(packerAlgorithmSettingAtom);
  const size = get(sheetMaxSizeSettingAtom);
  const pot = get(potSettingAtom);
  const allowRotation = get(allowRotationSettingAtom);
  const padding = get(spritePaddingSettingAtom);
  const sprites = get(spritesForPackerAtom);
  const edgeSpacing = get(edgeSpacingSettingAtom);
  const itemIdToFolderIdMap = get(itemIdToFolderIdMapAtom);
  const multipack = get(multipackSettingAtom);
  const options: tPackerOptions = {
    sprites,
    size,
    padding,
    edgeSpacing,
    pot,
    allowRotation,
    tags: itemIdToFolderIdMap,
    forceSingleBin: multipack === "off",
  };
  const packer = getPacker(algorithm);
  return packer.pack(options);
});
const getPacker = (algorithm: tPackerAlgorithm): tPacker => {
  switch (algorithm) {
    case "maxRects":
      return maxRectsPacker;
    case "grid":
      return gridPacker;
    case "basic":
      return basicPacker;
    default:
      return maxRectsPacker;
  }
};
export const hasAnyPackedSpritesAtom = atom((get) => {
  return !isEmpty(get(packedSpritesAtom).bins);
});
