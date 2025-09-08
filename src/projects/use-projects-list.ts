import { useAtomValue } from "jotai";
import { projectsListAtom } from "./projects.atom";

export const useProjectsList = () => {
  const projects = useAtomValue(projectsListAtom);
  return projects;
};
