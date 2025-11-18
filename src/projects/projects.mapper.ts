import type { tPersistedProjectWithThumb } from "@/persistence/types";
import type { tProject } from "./types";
import {
  OUTPUT_DEFAULT_DATA_FILE_NAME,
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_IMAGE_QUALITY,
  OUTPUT_DEFAULT_PNG_COMPRESSION,
  OUTPUT_DEFAULT_TEXTURE_FILE_NAME,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_MULTIPACK_MODE,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_DEFAULT_SQUARE,
} from "#config";
import { isNumber } from "#utils/is-number";
import { isBoolean } from "#utils/is-boolean";
import type { tPackerSettings } from "@/packer/types";
import type { tOutputSettings } from "@/output/types";

export const persistedToProject = (
  project: tPersistedProjectWithThumb,
): tProject => {
  const thumbUrl = project.thumb
    ? URL.createObjectURL(project.thumb)
    : undefined;
  return {
    id: project.id,
    name: project.name,
    thumbUrl,
    createdAt: project.createdAt,
    lastOpenedAt: project.lastOpenedAt,
    packerSettings: persistedToPackerSettings(project),
    outputSettings: persistedToOutputSettings(project),
  };
};

const persistedToPackerSettings = (
  project: tPersistedProjectWithThumb,
): tPackerSettings => ({
  packerAlgorithm: project.packerAlgorithm || PACKER_DEFAULT_ALGORITHM,
  sheetMaxSize: isNumber(project.sheetMaxSize)
    ? project.sheetMaxSize
    : PACKER_DEFAULT_SHEET_SIZE,
  spritePadding: isNumber(project.spritePadding)
    ? project.spritePadding
    : PACKER_DEFAULT_SPRITE_PADDING,
  edgeSpacing: isNumber(project.edgeSpacing)
    ? project.edgeSpacing
    : PACKER_DEFAULT_EDGE_SPACING,
  allowRotation: isBoolean(project.allowRotation)
    ? project.allowRotation
    : PACKER_DEFAULT_ALLOW_ROTATION,
  pot: isBoolean(project.pot) ? project.pot : PACKER_DEFAULT_POT,
  multipack: project.multipack || PACKER_DEFAULT_MULTIPACK_MODE,
  square: isBoolean(project.square) ? project.square : PACKER_DEFAULT_SQUARE,
});

const persistedToOutputSettings = (
  project: tPersistedProjectWithThumb,
): tOutputSettings => ({
  framework: project.framework || OUTPUT_DEFAULT_FRAMEWORK,
  textureFormat: project.textureFormat || OUTPUT_DEFAULT_TEXTURE_FORMAT,
  dataFileName: project.dataFileName || OUTPUT_DEFAULT_DATA_FILE_NAME,
  textureFileName: project.textureFileName || OUTPUT_DEFAULT_TEXTURE_FILE_NAME,
  pngCompression: isNumber(project.pngCompression)
    ? project.pngCompression
    : OUTPUT_DEFAULT_PNG_COMPRESSION,
  imageQuality: isNumber(project.imageQuality)
    ? project.imageQuality
    : OUTPUT_DEFAULT_IMAGE_QUALITY,
});
