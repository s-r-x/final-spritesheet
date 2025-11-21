import { useAtomValue, useStore } from "jotai";
import { activeProjectNameAtom } from "./projects.atom";

export const useActiveProjectName = () => {
  return useAtomValue(activeProjectNameAtom);
};

export const useGetActiveProjectName = () => {
  const atomsStore = useStore();
  return () => atomsStore.get(activeProjectNameAtom);
};
