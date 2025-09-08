import { useSetAtom } from "jotai";
import { updateProjectAtom } from "./projects.atom";
import { useCallback } from "react";
import type { tProject } from "./types";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useUpdateProject = () => {
  const updateProject = useSetAtom(updateProjectAtom);
  const eventBus = useEventBus();
  return useCallback((id: string, updates: Partial<Pick<tProject, "name">>) => {
    const wasUpdated = updateProject(id, updates);
    if (wasUpdated) {
      eventBus.emit("projectUpdated", { id, updates });
    }
  }, []);
};
