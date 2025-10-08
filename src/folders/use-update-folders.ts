import { useHistoryManager } from "@/history/use-history-manager";
import { useCallback } from "react";
import type { tUpdateFoldersArg } from "./types";
import { UpdateFoldersCommand } from "./update-folders.command";
import { isEmpty } from "#utils/is-empty";

export const useCreateUpdateFoldersCommand = () => {
  return useCallback((data: tUpdateFoldersArg) => {
    const command = new UpdateFoldersCommand({
      data,
    });
    return command;
  }, []);
};
export const useUpdateFolders = () => {
  const historyManager = useHistoryManager();
  const createUpdateFoldersCmd = useCreateUpdateFoldersCommand();
  return useCallback(
    async (data: tUpdateFoldersArg) => {
      if (isEmpty(data)) return;
      const command = createUpdateFoldersCmd(data);
      await historyManager.execCommand(command);
    },
    [historyManager, createUpdateFoldersCmd],
  );
};
