import { SPRITES_ROOT_FOLDER_ID } from "#config";
import type { tFolder } from "./types";

export const isRootFolder = (folder: string | tFolder): boolean => {
  return (
    (typeof folder === "string" ? folder : folder.id) === SPRITES_ROOT_FOLDER_ID
  );
};
