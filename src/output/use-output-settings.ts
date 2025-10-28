import { useAtomValue, useStore } from "jotai";
import { useCallback } from "react";
import {
  outputSettingsAtom,
  outputSettingsFormVersionAtom,
} from "./output-settings.atom";

export const useOutputSettings = () => {
  return useAtomValue(outputSettingsAtom);
};
export const useOutputFramework = () => {
  return useOutputSettings().framework;
};
export const useOutputSettingsFormVersion = () => {
  return useAtomValue(outputSettingsFormVersionAtom);
};
export const useGetOutputSettings = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(outputSettingsAtom);
  }, []);
};
