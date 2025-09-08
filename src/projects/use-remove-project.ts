import { useSetAtom } from "jotai";
import { removeProjectAtom } from "./projects.atom";
import { useCallback } from "react";
import { useEventBus } from "@/event-bus/use-event-bus";
import { useRouter } from "@tanstack/react-router";
import { useGetActiveProjectId } from "./use-active-project-id";

export const useRemoveProject = () => {
  const removeProject = useSetAtom(removeProjectAtom);
  const router = useRouter();
  const eventBus = useEventBus();
  const getActiveProjectId = useGetActiveProjectId();
  return useCallback((id: string) => {
    const activeId = getActiveProjectId();
    removeProject(id);
    eventBus.emit("projectRemoved", { id });
    if (activeId === id) {
      router.invalidate();
    }
  }, []);
};
