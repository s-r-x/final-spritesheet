import { useAtomValue, useStore } from "jotai";
import { activeProjectIdAtom } from "./projects.atom";
import { useCallback } from "react";

export const useActiveProjectId = () => {
  const id = useAtomValue(activeProjectIdAtom);
  return id;
};
export const useGetActiveProjectId = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(activeProjectIdAtom);
  }, []);
};
