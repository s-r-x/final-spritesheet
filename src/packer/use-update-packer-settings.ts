import { useActiveProjectId } from "@/projects/use-active-project-id";
import type { tPackerSettings } from "./types";
import { useGetPackerSettings } from "./use-packer-settings";
import { useHistoryManager } from "@/history/use-history-manager";
import { UpdatePackerSettingsCommand } from "./update-packer-settings.command";

export const useUpdatePackerSettings = () => {
  const projectId = useActiveProjectId()!;
  const getPackerSettings = useGetPackerSettings();
  const historyManager = useHistoryManager();
  return async (settings: Partial<tPackerSettings>) => {
    const originalSettings = getPackerSettings();
    const command = new UpdatePackerSettingsCommand({
      originalSettings,
      settings,
      projectId,
    });
    await historyManager.execCommand(command);
  };
};
