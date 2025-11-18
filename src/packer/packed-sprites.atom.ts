import { atom } from "jotai";
import {
  packerAlgorithmSettingAtom,
  sheetMaxSizeSettingAtom,
  potSettingAtom,
  allowRotationSettingAtom,
  spritePaddingSettingAtom,
  edgeSpacingSettingAtom,
  multipackSettingAtom,
  squareSettingAtom,
} from "./settings.atom";
import { spritesAtom } from "@/input/sprites.atom";
import { isEmpty } from "#utils/is-empty";
import { selectAtom } from "jotai/utils";
import { packerSpriteExcerptFields } from "./config";
import type {
  tPacker,
  tPackerAlgorithm,
  tPackerOptions,
  tPackerReturnValue,
  tPackerSpriteExcerpt,
  tPackerStatus,
} from "./types";
import { maxRectsPacker } from "./max-rects.packer";
import { gridPacker } from "./grid.packer";
import { basicPacker } from "./basic.packer";
import { normalizedCustomBinsAtom } from "#custom-bins/custom-bins.atom";
import { pick } from "#utils/pick";
import { foldersAtom } from "@/folders/folders.atom";
import { loggerAtom } from "@/logger/logger.atom";
import { outputSettingsAtom } from "@/output/output-settings.atom";
import { checkPackerRotationSupport } from "./check-rotation-support";

export const spritesForPackerAtom = selectAtom(
  spritesAtom,
  (sprites): tPackerSpriteExcerpt[] =>
    sprites.map((sprite) => pick(sprite, packerSpriteExcerptFields)),
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
  const square = get(squareSettingAtom);
  const allowRotation = get(allowRotationSettingAtom);
  const padding = get(spritePaddingSettingAtom);
  const edgeSpacing = get(edgeSpacingSettingAtom);
  const multipack = get(multipackSettingAtom);
  const partialOptions: Omit<tPackerOptions, "sprites"> = {
    size,
    padding,
    edgeSpacing,
    pot,
    square,
    allowRotation,
    forceSingleBin: multipack !== "auto",
  };
  const packer = getPacker(algorithm);

  if (multipack === "manual") {
    const customBins = get(normalizedCustomBinsAtom);
    return customBins.reduce(
      (acc, { bin: customBin, folders, items }) => {
        const sprites = items.concat(folders.flatMap((folder) => folder.items));
        const localPacker = customBin.useGlobalPackerOptions
          ? packer
          : getPacker(customBin.packerAlgorithm);
        const options: tPackerOptions = customBin.useGlobalPackerOptions
          ? { ...partialOptions, sprites }
          : {
              size: customBin.packerSheetMaxSize,
              padding: customBin.packerSpritePadding,
              edgeSpacing: customBin.packerEdgeSpacing,
              pot: customBin.packerPot,
              square: customBin.packerSquare,
              allowRotation: checkPackerRotationSupport({
                framework: get(outputSettingsAtom).framework,
                algorithm: customBin.packerAlgorithm,
              })
                ? customBin.packerAllowRotation
                : false,
              forceSingleBin: true,
              sprites,
            };
        const {
          bins: [packedBin],
          oversizedSprites,
        } = localPacker.pack(options);
        if (packedBin) {
          packedBin.id = customBin.id;
          packedBin.name = customBin.name;
          acc.bins.push(packedBin);
        }
        if (!isEmpty(oversizedSprites)) {
          acc.oversizedSpritesPerBin[customBin.id] = oversizedSprites;
          acc.oversizedSprites.push(...oversizedSprites);
        }
        return acc;
      },
      {
        bins: [],
        oversizedSprites: [],
        oversizedSpritesPerBin: {},
      } as Required<tPackerReturnValue>,
    );
  } else if (multipack === "byFolder") {
    const logger = get(loggerAtom);
    const sprites = get(spritesForPackerAtom);
    const spritesMap = sprites.reduce(
      (acc, sprite) => {
        acc[sprite.id] = sprite;
        return acc;
      },
      {} as Record<string, tPackerSpriteExcerpt>,
    );
    const folders = get(foldersAtom);
    return folders.reduce(
      (acc, folder) => {
        if (isEmpty(folder.itemIds)) return acc;

        const {
          bins: [packedBin],
          oversizedSprites,
        } = packer.pack({
          ...partialOptions,
          sprites: folder.itemIds.reduce((acc, spriteId) => {
            const sprite = spritesMap[spriteId];
            if (sprite) {
              acc.push(sprite);
            } else {
              logger?.warn({
                layer: "app",
                label: "missingSprite",
                data: {
                  message: `Cannot find sprite ${spriteId} in the sprites map`,
                },
              });
            }
            return acc;
          }, [] as tPackerSpriteExcerpt[]),
        });
        if (packedBin) {
          packedBin.name = folder.name;
          packedBin.id = folder.id;
          acc.bins.push(packedBin);
        }
        if (!isEmpty(oversizedSprites)) {
          acc.oversizedSprites.push(...oversizedSprites);
        }
        return acc;
      },

      {
        bins: [],
        oversizedSprites: [],
        oversizedSpritesPerBin: {},
      } as Required<tPackerReturnValue>,
    );
  } else {
    const sprites = get(spritesForPackerAtom);
    return packer.pack({
      ...partialOptions,
      sprites,
    });
  }
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

export const packerStatusAtom = atom((get): tPackerStatus => {
  const packed = get(packedSpritesAtom);
  const hasPacked = get(hasAnyPackedSpritesAtom);
  const hasOversized = packed.oversizedSprites.length > 0;
  if (hasPacked && hasOversized) return "partially_packed";
  if (hasPacked && !hasOversized) return "packed";
  if (!hasPacked && hasOversized) return "failed";
  return "idle";
});
