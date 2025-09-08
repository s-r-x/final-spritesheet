import { useAtomValue, useStore } from "jotai";
import { useCallback } from "react";
import { packerSettingsAtom } from "./settings.atom";
import type { tPackerSettings } from "./types";

export const usePackerSettings = () => {
  return useAtomValue(packerSettingsAtom);
};
export const useGetPackerSettings = () => {
  const atomsStore = useStore();
  return useCallback((): tPackerSettings => {
    return atomsStore.get(packerSettingsAtom);
  }, []);
};
