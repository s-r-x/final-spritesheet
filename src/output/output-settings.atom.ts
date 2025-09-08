import { atom } from "jotai";
import { tOutputSettings } from "./types";
import {
  OUTPUT_DEFAULT_DATA_FILE_NAME,
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_IMAGE_QUALITY,
  OUTPUT_DEFAULT_PNG_COMPRESSION,
  OUTPUT_DEFAULT_TEXTURE_FILE_NAME,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
} from "#config";
import { activeProjectAtom, updateProjectAtom } from "@/projects/projects.atom";

const defaultSettings: tOutputSettings = {
  framework: OUTPUT_DEFAULT_FRAMEWORK,
  textureFormat: OUTPUT_DEFAULT_TEXTURE_FORMAT,
  dataFileName: OUTPUT_DEFAULT_DATA_FILE_NAME,
  textureFileName: OUTPUT_DEFAULT_TEXTURE_FILE_NAME,
  pngCompression: OUTPUT_DEFAULT_PNG_COMPRESSION,
  imageQuality: OUTPUT_DEFAULT_IMAGE_QUALITY,
};
export const outputSettingsAtom = atom<
  tOutputSettings,
  [Partial<tOutputSettings>],
  undefined
>(
  (get) => get(activeProjectAtom)?.outputSettings || defaultSettings,
  (get, set, value) => {
    const project = get(activeProjectAtom);
    if (!project) return;
    set(updateProjectAtom, project.id, {
      outputSettings: {
        ...get(outputSettingsAtom),
        ...value,
      },
    });
  },
);
