import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useCallback } from "react";
import type { tPackerSettings } from "./types";
import { useStore } from "jotai";
import { packerSettingsAtom } from "./settings.atom";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useUpdatePackerSettings = () => {
  const projectId = useActiveProjectId()!;
  const atomsStore = useStore();
  const eventBus = useEventBus();
  return useCallback(
    (settings: Partial<tPackerSettings>) => {
      atomsStore.set(packerSettingsAtom, settings);
      eventBus.emit("packerSettingsUpdated", {
        projectId,
        settings,
      });
    },
    [projectId],
  );
};
