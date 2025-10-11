import { useStore } from "jotai";
import { spritesAtom } from "./sprites.atom";
import { useCallback } from "react";
import type { tSprite } from "./types";
import { RemoveSpritesCommand } from "./remove-sprites.command";
import { useHistoryManager } from "@/history/use-history-manager";
import { useCreateUpdateFoldersCommand } from "@/folders/use-update-folders";
import { foldersAtom } from "@/folders/folders.atom";
import { tUpdateFoldersArg } from "@/folders/types";
import { isEmpty } from "#utils/is-empty";
import { Command } from "@/common/commands/command";

export const useCreateRemoveSpritesCommand = () => {
  const atomsStore = useStore();
  return useCallback((id: string | string[]) => {
    const spritesToRemove = atomsStore
      .get(spritesAtom)
      .reduce((acc, sprite) => {
        const matched = Array.isArray(id)
          ? id.includes(sprite.id)
          : sprite.id === id;
        if (matched) {
          acc.push(sprite);
        }

        return acc;
      }, [] as tSprite[]);
    const command = new RemoveSpritesCommand({ sprites: spritesToRemove });
    return command;
  }, []);
};
export const useRemoveSprites = () => {
  const atomsStore = useStore();
  const historyManager = useHistoryManager();
  const createRemoveSpritesCmd = useCreateRemoveSpritesCommand();
  const createUpdateFoldersCmd = useCreateUpdateFoldersCommand();
  return useCallback(
    async (
      id: string | string[],
      { removeFromFolders = true }: { removeFromFolders?: boolean } = {},
    ) => {
      const cmds: Command[] = [createRemoveSpritesCmd(id)];
      if (removeFromFolders) {
        const idsToRemoveSet = new Set(Array.isArray(id) ? id : [id]);
        const folders = atomsStore.get(foldersAtom);
        const updateFoldersArg = folders.reduce((acc, folder) => {
          const newItemIds = folder.itemIds.filter(
            (idInsideFolder) => !idsToRemoveSet.has(idInsideFolder),
          );
          if (newItemIds.length !== folder.itemIds.length) {
            acc[folder.id] = {
              folder,
              data: {
                itemIds: newItemIds,
              },
            };
          }
          return acc;
        }, {} as tUpdateFoldersArg);
        if (!isEmpty(updateFoldersArg)) {
          cmds.push(createUpdateFoldersCmd(updateFoldersArg));
        }
      }
      await historyManager.execCommand(cmds);
    },
    [historyManager, createRemoveSpritesCmd, createUpdateFoldersCmd],
  );
};
