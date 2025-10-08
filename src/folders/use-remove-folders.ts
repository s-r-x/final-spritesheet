import { useHistoryManager } from "@/history/use-history-manager";
import { useStore } from "jotai";
import { useCallback } from "react";
import { normalizedFoldersAtom } from "./folders.atom";
import type { tFolder } from "./types";
import { RemoveFoldersCommand } from "./remove-folders.command";
import { useCreateRemoveSpritesCommand } from "@/input/use-remove-sprites";
import type { Command } from "@/common/commands/command";
import { isEmpty } from "#utils/is-empty";
import { isRootFolder } from "./is-root-folder";

export const useRemoveFolders = () => {
  const atomsStore = useStore();
  const historyManager = useHistoryManager();
  const createRemoveSpritesCommand = useCreateRemoveSpritesCommand();
  return useCallback(
    async (id: string | string[]) => {
      const { folders: foldersToRemove, sprites: spritesToRemove } = atomsStore
        .get(normalizedFoldersAtom)
        .reduce(
          (acc, { folder }) => {
            const matched = Array.isArray(id)
              ? id.includes(folder.id)
              : folder.id === id;
            if (matched) {
              if (!isRootFolder(folder)) {
                acc.folders.push(folder);
              }
              acc.sprites.push(...folder.itemIds);
            }

            return acc;
          },
          { folders: [], sprites: [] } as {
            folders: tFolder[];
            sprites: string[];
          },
        );
      const cmds: Command[] = [];
      if (!isEmpty(foldersToRemove)) {
        const cmd = new RemoveFoldersCommand({ folders: foldersToRemove });
        cmds.push(cmd);
      }
      if (!isEmpty(spritesToRemove)) {
        const cmd = createRemoveSpritesCommand(spritesToRemove);
        cmds.push(cmd);
      }
      if (!isEmpty(cmds)) {
        await historyManager.execCommand(cmds);
      }
    },
    [historyManager, createRemoveSpritesCommand],
  );
};
