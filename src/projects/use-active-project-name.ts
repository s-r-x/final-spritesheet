import { useAtomValue, useStore } from "jotai";
import { activeProjectNameAtom } from "./projects.atom";
import { useCallback } from "react";

export const useActiveProjectName = () => {
  return useAtomValue(activeProjectNameAtom);
};

export const useGetActiveProjectName = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(activeProjectNameAtom);
  }, []);
};
