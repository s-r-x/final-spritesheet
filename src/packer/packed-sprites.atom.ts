import { atom } from "jotai";
import {
  //packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
} from "./settings.atom";
import { spritesAtom } from "@/input/sprites.atom";
import { packMaxRects } from "./packer-max-rects";
import { isEmpty } from "#utils/is-empty";
import { itemIdToFolderIdMapAtom } from "@/folders/folders.atom";
import { selectAtom } from "jotai/utils";
import { packerSpriteExcerptFields } from "./config";

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
  //const algorithm = get(packerAlgorithmSettingAtom);
  const size = get(sheetMaxSizeSettingAtom);
  const pot = get(potSettingAtom);
  const allowRotation = get(allowRotationSettingAtom);
  const padding = get(spritePaddingSettingAtom);
  const sprites = get(spritesForPackerAtom);
  const edgeSpacing = get(edgeSpacingSettingAtom);
  const itemIdToFolderIdMap = get(itemIdToFolderIdMapAtom);
  return packMaxRects({
    sprites,
    size,
    padding,
    edgeSpacing,
    pot,
    allowRotation,
    tags: itemIdToFolderIdMap,
  });
});
export const hasAnyPackedSpritesAtom = atom((get) => {
  return !isEmpty(get(packedSpritesAtom).bins);
});
