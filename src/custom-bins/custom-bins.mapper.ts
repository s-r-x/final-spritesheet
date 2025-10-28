import type { tPersistedCustomBin } from "@/persistence/types";
import type { tCustomBin } from "./types";
import {
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
} from "#config";
import { isNumber } from "#utils/is-number";
import { isBoolean } from "#utils/is-boolean";

export const persistedToCustomBin = ({
  packerAlgorithm,
  packerAllowRotation,
  packerEdgeSpacing,
  packerPot,
  packerSheetMaxSize,
  packerSpritePadding,
  ...bin
}: tPersistedCustomBin): tCustomBin => {
  return {
    ...bin,
    useGlobalPackerOptions: isBoolean(bin.useGlobalPackerOptions)
      ? bin.useGlobalPackerOptions
      : true,
    packerAlgorithm: packerAlgorithm || PACKER_DEFAULT_ALGORITHM,
    packerSheetMaxSize: isNumber(packerSheetMaxSize)
      ? packerSheetMaxSize
      : PACKER_DEFAULT_SHEET_SIZE,
    packerSpritePadding: isNumber(packerSpritePadding)
      ? packerSpritePadding
      : PACKER_DEFAULT_SPRITE_PADDING,
    packerEdgeSpacing: isNumber(packerEdgeSpacing)
      ? packerEdgeSpacing
      : PACKER_DEFAULT_EDGE_SPACING,
    packerAllowRotation: isBoolean(packerAllowRotation)
      ? packerAllowRotation
      : PACKER_DEFAULT_ALLOW_ROTATION,
    packerPot: isBoolean(packerPot) ? packerPot : PACKER_DEFAULT_POT,
  };
};
