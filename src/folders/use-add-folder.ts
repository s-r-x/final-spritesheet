import { useHistoryManager } from "@/history/use-history-manager";
import { useCallback } from "react";
import type { tFolder } from "./types";
import { AddFolderCommand } from "./add-folder.command";
import { generateId } from "#utils/generate-id";
import { generateUniqueName } from "#utils/generate-unique-name";

export const useAddFolder = () => {
  const historyManager = useHistoryManager();
  return useCallback(
    async ({
      id = generateId(),
      name = generateUniqueName(),
      itemIds = [],
      createdAt = new Date().toISOString(),
      ...rest
    }: Partial<Omit<tFolder, "projectId">> & Pick<tFolder, "projectId">) => {
      if (!rest.projectId) {
        throw new Error("no project id");
      }
      const command = new AddFolderCommand({
        folder: { id, name, itemIds, createdAt, ...rest },
      });
      await historyManager.execCommand(command);
    },
    [historyManager],
  );
};
