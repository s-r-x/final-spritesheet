import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { addProjectAtom } from "./projects.atom";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tProject } from "./types";
import { generateId } from "#utils/generate-id";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useCreateProject = () => {
  const addProjectToAtom = useSetAtom(addProjectAtom);
  const eventBus = useEventBus();
  const createProject = useCallback(() => {
    const project: tProject = {
      id: generateId(),
      name: generateUniqueName(),
      createdAt: new Date().toISOString(),
    };
    eventBus.emit("projectCreated", { project });
    addProjectToAtom(project);
    return { project };
  }, []);
  return createProject;
};
