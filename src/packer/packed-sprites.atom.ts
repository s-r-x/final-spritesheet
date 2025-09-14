import { atom } from "jotai";
import {
  //packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
} from "./settings.atom";
import { spritesAtom } from "@/sprites/sprites.atom";
import { packMaxRects } from "./packer-max-rects";
import { isEmpty } from "#utils/is-empty";

export const packedSpritesAtom = atom((get) => {
  //const algorithm = get(packerAlgorithmSettingAtom);
  const size = get(sheetMaxSizeSettingAtom);
  const pot = get(potSettingAtom);
  const allowRotation = get(allowRotationSettingAtom);
  const padding = get(spritePaddingSettingAtom);
  const sprites = get(spritesAtom);
  const edgeSpacing = get(edgeSpacingSettingAtom);
  return packMaxRects({
    sprites,
    size,
    padding,
    edgeSpacing,
    pot,
    allowRotation,
  });
});
export const hasAnyPackedSpritesAtom = atom((get) => {
  return !isEmpty(get(packedSpritesAtom).bins);
});
