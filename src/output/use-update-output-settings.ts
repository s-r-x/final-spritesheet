import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useCallback } from "react";
import type { tOutputSettings } from "./types";
import { useGetOutputSettings } from "./use-output-settings";
import { useHistoryManager } from "@/history/use-history-manager";
import { UpdateOutputSettingsCommand } from "./update-output-settings.command";

export const useUpdateOutputSettings = () => {
  const projectId = useActiveProjectId()!;
  const getOutputSettings = useGetOutputSettings();
  const historyManager = useHistoryManager();
  return useCallback(
    async (settings: Partial<tOutputSettings>) => {
      const originalSettings = getOutputSettings();
      const command = new UpdateOutputSettingsCommand({
        originalSettings,
        settings,
        projectId,
      });
      await historyManager.execCommand(command);
    },
    [projectId, historyManager],
  );
};
