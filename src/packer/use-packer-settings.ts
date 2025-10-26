import { useAtomValue, useStore } from "jotai";
import { useCallback } from "react";
import {
  multipackSettingAtom,
  packerSettingsAtom,
  packerSettingsFormVersionAtom,
  rotationSupportabilityAtom,
} from "./settings.atom";
import type { tPackerSettings } from "./types";

export const usePackerSettingsFormVersion = () => {
  return useAtomValue(packerSettingsFormVersionAtom);
};

export const usePackerSettings = () => {
  return useAtomValue(packerSettingsAtom);
};
export const useGetPackerSettings = () => {
  const atomsStore = useStore();
  return useCallback((): tPackerSettings => {
    return atomsStore.get(packerSettingsAtom);
  }, []);
};

export const useIsRotationSupported = () => {
  return useAtomValue(rotationSupportabilityAtom);
};

export const usePackerMultipackMode = () => {
  return useAtomValue(multipackSettingAtom);
};
