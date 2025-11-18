import { MIME_TYPES } from "@mantine/dropzone";
import type { tLogLevel } from "./logger/types";

export const SUPPORTED_SPRITE_MIME_TYPES: string[] = [
  MIME_TYPES.png,
  MIME_TYPES.jpeg,
  MIME_TYPES.webp,
  "image/bmp",
];

export const SUPPORTED_LANGUAGES: { value: string; label: string }[] = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "ru",
    label: "Русский",
  },
];

export const PACKER_ROTATION_SUPPORTED_FRAMEWORKS = new Set<tOutputFramework>([
  "pixi",
  "phaser",
]);
export const PACKER_SUPPORTED_SHEET_SIZES = [256, 128, 512, 1024, 2048, 4096];
export const PACKER_MAX_SPRITE_PADDING = 100;
export const PACKER_MAX_EDGE_SPACING = 100;
export const PACKER_DEFAULT_SHEET_SIZE = 4096;
export const PACKER_DEFAULT_SPRITE_PADDING = 0;
export const PACKER_DEFAULT_EDGE_SPACING = 0;
export const PACKER_DEFAULT_ALLOW_ROTATION = false;
export const PACKER_DEFAULT_POT = true;
export const PACKER_DEFAULT_SQUARE = false;
export const PACKER_SUPPORTED_ALGORITHMS = [
  "maxRects",
  "grid",
  "basic",
] as const;
export type tPackerAlgorithm = (typeof PACKER_SUPPORTED_ALGORITHMS)[number];
export const PACKER_DEFAULT_ALGORITHM: tPackerAlgorithm = "maxRects";
export const PACKER_SUPPORTED_MULTIPACK_MODES = [
  "off",
  "auto",
  "manual",
  "byFolder",
] as const;
export type tPackerMultipackMode =
  (typeof PACKER_SUPPORTED_MULTIPACK_MODES)[number];
export const PACKER_DEFAULT_MULTIPACK_MODE: tPackerMultipackMode = "auto";
export const PACKER_ROTATION_SUPPORTED_ALGORITHMS = new Set<tPackerAlgorithm>([
  "maxRects",
]);

export const SUPPORTED_OUTPUT_FRAMEWORKS = ["pixi", "phaser", "godot"] as const;
export type tOutputFramework = (typeof SUPPORTED_OUTPUT_FRAMEWORKS)[number];
export const SUPPORTED_OUTPUT_IMAGE_FORMATS = ["png", "jpeg", "webp"];
export const OUTPUT_DEFAULT_PNG_COMPRESSION = 0;
export const OUTPUT_DEFAULT_IMAGE_QUALITY = 100;
export const OUTPUT_DEFAULT_TEXTURE_FORMAT = "png";
export const OUTPUT_DEFAULT_TEXTURE_FILE_NAME = "texture";
export const OUTPUT_DEFAULT_FRAMEWORK: tOutputFramework = "pixi";
export const OUTPUT_DEFAULT_DATA_FILE_NAME = "data";
export const OUTPUT_MAX_DATA_FILE_NAME_LENGTH = 256;
export const OUTPUT_MAX_TEXTURE_FILE_NAME_LENGTH = 256;
export const OUTPUT_ENABLE_PNG_COMPRESSION = false;

export const DB_NAME = "final-spritesheet";

export const DEV = import.meta.env?.DEV;
export const PROD = import.meta.env?.PROD;

export const BASE_URL = import.meta.env?.BASE_URL;

export const LOG_LEVELS: Set<tLogLevel> = new Set(
  PROD ? ["info", "warn"] : ["debug", "info", "warn"],
);

export const SPRITES_ROOT_FOLDER_ID = "__ROOT__";
export const DEFAULT_CUSTOM_BIN_ID = "__DEFAULT_BIN__";
