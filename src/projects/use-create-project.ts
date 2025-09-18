import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { addProjectAtom } from "./projects.atom";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tProject } from "./types";
import { generateId } from "#utils/generate-id";
import { useDbMutations } from "@/persistence/use-db";

export const useCreateProject = () => {
  const addProjectToAtom = useSetAtom(addProjectAtom);
  const dbMutations = useDbMutations();
  const createProject = useCallback(async () => {
    const project: tProject = {
      id: generateId(),
      name: generateUniqueName(),
      createdAt: new Date().toISOString(),
    };
    await dbMutations.createNewProject(project);
    addProjectToAtom(project);
    return { project };
  }, []);
  return createProject;
};
