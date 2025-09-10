import { atom } from "jotai";
import type { tPackerAlgorithm, tPackerSettings } from "./types";
import {
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_ROTATION_SUPPORTED_FRAMEWORKS,
} from "#config";
import { activeProjectAtom, updateProjectAtom } from "@/projects/projects.atom";
import { outputSettingsAtom } from "@/output/output-settings.atom";

const defaultSettings: tPackerSettings = {
  packerAlgorithm: "grid",
  sheetMaxSize: PACKER_DEFAULT_SHEET_SIZE,
  spritePadding: PACKER_DEFAULT_SPRITE_PADDING,
  edgeSpacing: PACKER_DEFAULT_EDGE_SPACING,
  pot: PACKER_DEFAULT_POT,
  allowRotation: PACKER_DEFAULT_ALLOW_ROTATION,
};
export const packerSettingsAtom = atom<
  tPackerSettings,
  [Partial<tPackerSettings>],
  undefined
>(
  (get) => get(activeProjectAtom)?.packerSettings || defaultSettings,
  (get, set, value) => {
    const project = get(activeProjectAtom);
    if (!project) return;
    set(updateProjectAtom, project.id, {
      packerSettings: {
        ...get(packerSettingsAtom),
        ...value,
      },
    });
  },
);

export const rotationSupportabilityAtom = atom((get) => {
  const framework = get(outputSettingsAtom).framework;
  return PACKER_ROTATION_SUPPORTED_FRAMEWORKS.has(framework);
});
export const packerAlgorithmSettingAtom = atom(
  (get) => get(packerSettingsAtom).packerAlgorithm,
  (_get, set, packerAlgorithm: tPackerAlgorithm) => {
    set(packerSettingsAtom, { packerAlgorithm });
  },
);
export const sheetMaxSizeSettingAtom = atom(
  (get) => get(packerSettingsAtom).sheetMaxSize,
  (_get, set, sheetMaxSize: number) => {
    set(packerSettingsAtom, { sheetMaxSize });
  },
);
export const spritePaddingSettingAtom = atom(
  (get) => get(packerSettingsAtom).spritePadding,
  (_get, set, spritePadding: number) => {
    set(packerSettingsAtom, { spritePadding });
  },
);

export const edgeSpacingSettingAtom = atom(
  (get) => get(packerSettingsAtom).edgeSpacing,
  (_get, set, edgeSpacing: number) => {
    set(packerSettingsAtom, { edgeSpacing });
  },
);
export const potSettingAtom = atom(
  (get) => get(packerSettingsAtom).pot,
  (_get, set, pot: boolean) => {
    set(packerSettingsAtom, { pot });
  },
);
export const allowRotationSettingAtom = atom(
  (get) => {
    const isSupported = get(rotationSupportabilityAtom);
    if (!isSupported) return false;
    return get(packerSettingsAtom).allowRotation;
  },
  (_get, set, allowRotation: boolean) => {
    set(packerSettingsAtom, { allowRotation });
  },
);
