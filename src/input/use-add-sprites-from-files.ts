import { useCallback } from "react";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import type { tSprite } from "./types";
import { fileToSprite } from "./sprites.mapper";
import { useHistoryManager } from "@/history/use-history-manager";
import { AddSpritesCommand } from "./add-sprites.command";
import { useMutation } from "@/common/hooks/use-mutation";
import { useCreateUpdateFoldersCommand } from "@/folders/use-update-folders";
import { Command } from "@/common/commands/command";
import { useStore } from "jotai";
import type { tFolder } from "@/folders/types";
import { isEmpty } from "#utils/is-empty";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";

export const useAddSpritesFromFiles = () => {
  const atomsStore = useStore();
  const projectId = useActiveProjectId();
  const historyManager = useHistoryManager();
  const createUpdateFoldersCommand = useCreateUpdateFoldersCommand();
  return useCallback(
    async ({ files, folder }: { files: File[]; folder?: tFolder }) => {
      files = files.filter((file) =>
        SUPPORTED_SPRITE_MIME_TYPES.includes(file.type),
      );
      if (isEmpty(files)) return;
      if (!projectId) {
        throw new Error("no project id");
      }
      const sprites: tSprite[] = await Promise.all(
        files.map((file) => fileToSprite({ file, projectId })),
      );
      const cmds: Command[] = [new AddSpritesCommand({ sprites })];
      if (folder) {
        const updateFoldersCmd = createUpdateFoldersCommand({
          [folder.id]: {
            folder,
            data: {
              itemIds: folder.itemIds.concat(
                sprites.map((sprite) => sprite.id),
              ),
            },
          },
        });
        cmds.push(updateFoldersCmd);
      }
      await historyManager.execCommand(cmds);
    },
    [projectId, historyManager, createUpdateFoldersCommand, atomsStore],
  );
};

export const useAddSpritesFromFilesMutation = () => {
  const addSprites = useAddSpritesFromFiles();
  const mut = useMutation(addSprites);
  return mut;
};
