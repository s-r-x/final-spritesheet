import { useHistoryManager } from "@/history/use-history-manager";
import { useCallback } from "react";
import type { tUpdateCustomBinsArg } from "./types";
import { UpdateCustomBinsCommand } from "./update-custom-bins.command";
import { isEmpty } from "#utils/is-empty";

export const useCreateUpdateCustomBinsCommand = () => {
  return useCallback((data: tUpdateCustomBinsArg) => {
    const command = new UpdateCustomBinsCommand({
      data,
    });
    return command;
  }, []);
};
export const useUpdateCustomBins = () => {
  const historyManager = useHistoryManager();
  const createUpdateCustomBinsCmd = useCreateUpdateCustomBinsCommand();
  return useCallback(
    async (data: tUpdateCustomBinsArg) => {
      if (isEmpty(data)) return;
      const command = createUpdateCustomBinsCmd(data);
      await historyManager.execCommand(command);
    },
    [historyManager, createUpdateCustomBinsCmd],
  );
};
