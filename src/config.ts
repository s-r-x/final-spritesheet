import { MIME_TYPES } from "@mantine/dropzone";
import type { tLogLevel } from "./logger/types";

export const SUPPORTED_SPRITE_MIME_TYPES: string[] = [
  MIME_TYPES.png,
  MIME_TYPES.jpeg,
  MIME_TYPES.webp,
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

export const SUPPORTED_FRAMEWORKS: { value: string; label: string }[] = [
  { value: "pixi", label: "PixiJS" },
  { value: "phaser", label: "Phaser" },
  { value: "godot", label: "Godot" },
];
export const PACKER_ROTATION_SUPPORTED_FRAMEWORKS = new Set(["pixi", "phaser"]);

export const PACKER_SUPPORTED_SHEET_SIZES = [256, 128, 512, 1024, 2048, 4096];
export const PACKER_MAX_SPRITE_PADDING = 100;
export const PACKER_MAX_EDGE_SPACING = 100;
export const PACKER_DEFAULT_SHEET_SIZE = 4096;
export const PACKER_DEFAULT_SPRITE_PADDING = 0;
export const PACKER_DEFAULT_EDGE_SPACING = 0;
export const PACKER_DEFAULT_ALLOW_ROTATION = false;
export const PACKER_DEFAULT_POT = true;

export const SUPPORTED_OUTPUT_IMAGE_FORMATS = ["png", "jpeg", "webp"];
export const OUTPUT_DEFAULT_PNG_COMPRESSION = 0;
export const OUTPUT_DEFAULT_IMAGE_QUALITY = 100;
export const OUTPUT_DEFAULT_TEXTURE_FORMAT = "png";
export const OUTPUT_DEFAULT_TEXTURE_FILE_NAME = "texture";
export const OUTPUT_DEFAULT_FRAMEWORK = SUPPORTED_FRAMEWORKS[0].value;
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
