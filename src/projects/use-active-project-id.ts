import { useAtomValue, useStore } from "jotai";
import { activeProjectIdAtom } from "./projects.atom";

export const useActiveProjectId = () => {
  const id = useAtomValue(activeProjectIdAtom);
  return id;
};
export const useGetActiveProjectId = () => {
  const atomsStore = useStore();
  return () => atomsStore.get(activeProjectIdAtom);
};
