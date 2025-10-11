import { atom } from "jotai";
import {
  //packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
} from "./settings.atom";
import { spritesAtom, spritesMapAtom } from "@/input/sprites.atom";
import { packMaxRects } from "./packer-max-rects";
import { isEmpty } from "#utils/is-empty";
import { itemIdToFolderIdMapAtom } from "@/folders/folders.atom";
import { selectAtom } from "jotai/utils";
import { pick } from "#utils/pick";
import { packerSpriteExcerptFields } from "./config";
import type { tPackedBin } from "./types";

export const spritesForPackerAtom = selectAtom(
  spritesAtom,
  // TODO:: this pick call is not really necessary
  (sprites) => sprites.map((sprite) => pick(sprite, packerSpriteExcerptFields)),
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
export const rawPackedSpritesAtom = atom((get) => {
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
export const packedSpritesAtom = atom((get) => {
  const packed = get(rawPackedSpritesAtom);
  const spritesMap = get(spritesMapAtom);
  return {
    bins: packed.bins.map(
      (bin): tPackedBin => ({
        ...bin,
        sprites: bin.sprites.map((sprite) => ({
          ...sprite,
          ...spritesMap[sprite.id],
        })),
      }),
    ),
    oversizedSprites: packed.oversizedSprites.map((s) => spritesMap[s.id]),
  };
});
export const hasAnyPackedSpritesAtom = atom((get) => {
  return !isEmpty(get(rawPackedSpritesAtom).bins);
});
