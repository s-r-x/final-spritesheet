import { useSetAtom } from "jotai";
import { updateProjectAtom } from "./projects.atom";
import { useCallback } from "react";
import { useDbMutations } from "@/persistence/use-db";
import type { tProject } from "./types";

export const useUpdateProject = () => {
  const updateProject = useSetAtom(updateProjectAtom);
  const dbMutations = useDbMutations();
  return useCallback(
    async (id: string, updates: Partial<Pick<tProject, "name">>) => {
      const wasUpdated = updateProject(id, updates);
      if (wasUpdated) {
        await dbMutations.updateProject(id, updates);
      }
    },
    [dbMutations],
  );
};
