import { useEventBus } from "@/event-bus/use-event-bus";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useStore } from "jotai";
import { useCallback } from "react";
import { tOutputSettings } from "./types";
import { outputSettingsAtom } from "./output-settings.atom";

export const useUpdateOutputSettings = () => {
  const projectId = useActiveProjectId()!;
  const atomsStore = useStore();
  const eventBus = useEventBus();
  return useCallback(
    (settings: Partial<tOutputSettings>) => {
      atomsStore.set(outputSettingsAtom, settings);
      eventBus.emit("outputSettingsUpdated", {
        projectId,
        settings,
      });
    },
    [projectId],
  );
};
