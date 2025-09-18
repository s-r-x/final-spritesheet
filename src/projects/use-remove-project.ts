import { useSetAtom } from "jotai";
import { removeProjectAtom } from "./projects.atom";
import { useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { useGetActiveProjectId } from "./use-active-project-id";
import { useDbMutations } from "@/persistence/use-db";

export const useRemoveProject = () => {
  const removeProject = useSetAtom(removeProjectAtom);
  const router = useRouter();
  const getActiveProjectId = useGetActiveProjectId();
  const dbMutations = useDbMutations();
  return useCallback(
    async (id: string) => {
      const activeId = getActiveProjectId();
      removeProject(id);
      await dbMutations.removeProject(id);
      if (activeId === id) {
        router.invalidate();
      }
    },
    [, dbMutations],
  );
};
