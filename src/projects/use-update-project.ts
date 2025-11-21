import { useSetAtom } from "jotai";
import { updateProjectAtom } from "./projects.atom";
import { useDbMutations } from "@/persistence/use-db";
import type { tProject } from "./types";

export const useUpdateProject = () => {
  const updateProject = useSetAtom(updateProjectAtom);
  const dbMutations = useDbMutations();
  return async (
    id: string,
    updates: Partial<Pick<tProject, "name" | "lastOpenedAt">>,
  ) => {
    const wasUpdated = updateProject(id, updates);
    if (wasUpdated) {
      await dbMutations.updateProject(id, updates);
    }
  };
};
