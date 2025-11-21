import { useSetAtom } from "jotai";
import { addProjectAtom } from "./projects.atom";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tProject } from "./types";
import { generateId } from "#utils/generate-id";
import { useDbMutations } from "@/persistence/use-db";

export const useCreateProject = () => {
  const addProjectToAtom = useSetAtom(addProjectAtom);
  const dbMutations = useDbMutations();
  const createProject = async ({
    name = generateUniqueName(),
  }: {
    name?: string;
  } = {}) => {
    const project: tProject = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    await dbMutations.createNewProject(project);
    addProjectToAtom(project);
    return { project };
  };
  return createProject;
};
