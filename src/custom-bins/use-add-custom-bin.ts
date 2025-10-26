import { useHistoryManager } from "@/history/use-history-manager";
import { useCallback } from "react";
import { AddCustomBinCommand } from "./add-custom-bin.command";
import { generateId } from "#utils/generate-id";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tCustomBin } from "./types";

export const useAddCustomBin = () => {
  const historyManager = useHistoryManager();
  return useCallback(
    async ({
      id = generateId(),
      name = generateUniqueName(),
      itemIds = [],
      folderIds = [],
      createdAt = new Date().toISOString(),
      ...rest
    }: Partial<Omit<tCustomBin, "projectId">> &
      Pick<tCustomBin, "projectId">) => {
      if (!rest.projectId) {
        throw new Error("no project id");
      }
      const command = new AddCustomBinCommand({
        bin: { id, name, itemIds, folderIds, createdAt, ...rest },
      });
      await historyManager.execCommand(command);
    },
    [historyManager],
  );
};
