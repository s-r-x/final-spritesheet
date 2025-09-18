import { useCallback } from "react";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import type { tSprite } from "./types";
import { fileToSprite } from "./sprites.mapper";
import { useHistoryManager } from "@/history/use-history-manager";
import { AddSpritesCommand } from "./add-sprites.command";

export const useAddSpritesFromFiles = () => {
  const projectId = useActiveProjectId();
  const historyManager = useHistoryManager();
  return useCallback(
    async (files: File[]) => {
      if (!projectId) {
        throw new Error("no project id");
      }
      const sprites: tSprite[] = await Promise.all(
        files.map((file) => fileToSprite({ file, projectId })),
      );
      const command = new AddSpritesCommand({ sprites });
      historyManager.execCommand(command);
    },
    [projectId, historyManager],
  );
};
