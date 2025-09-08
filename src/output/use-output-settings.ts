import { useStore } from "jotai";
import { useCallback } from "react";
import { outputSettingsAtom } from "./output-settings.atom";

export const useGetOutputSettings = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(outputSettingsAtom);
  }, []);
};
