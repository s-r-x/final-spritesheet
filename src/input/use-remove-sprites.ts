import { useStore } from "jotai";
import { spritesAtom } from "./sprites.atom";
import type { tSprite } from "./types";
import { RemoveSpritesCommand } from "./remove-sprites.command";
import { useHistoryManager } from "@/history/use-history-manager";
import { useCreateUpdateFoldersCommand } from "@/folders/use-update-folders";
import type { tUpdateFoldersArg } from "@/folders/types";
import { isEmpty } from "#utils/is-empty";
import type { Command } from "@/common/commands/command";
import {
  useGetCustomBinsMap,
  useGetItemIdToCustomBinIdMap,
} from "#custom-bins/use-custom-bins";
import {
  useGetFoldersMap,
  useGetItemIdToFolderIdMap,
} from "@/folders/use-folders";
import type { tUpdateCustomBinsArg } from "#custom-bins/types";
import { useCreateUpdateCustomBinsCommand } from "#custom-bins/use-update-custom-bins";

export const useCreateRemoveSpritesCommand = () => {
  const atomsStore = useStore();
  return (id: string | string[]) => {
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
  };
};
export const useRemoveSprites = () => {
  const historyManager = useHistoryManager();
  const createRemoveSpritesCmd = useCreateRemoveSpritesCommand();
  const createUpdateFoldersCmd = useCreateUpdateFoldersCommand();
  const createUpdateBinsCmd = useCreateUpdateCustomBinsCommand();
  const getFoldersMap = useGetFoldersMap();
  const getItemIdToFolderIdMap = useGetItemIdToFolderIdMap();
  const getItemIdToBinIdMap = useGetItemIdToCustomBinIdMap();
  const getBinsMap = useGetCustomBinsMap();
  return async (
    id: string | string[],
    {
      removeFromFolders = true,
      removeFromCustomBins = true,
    }: { removeFromFolders?: boolean; removeFromCustomBins?: boolean } = {},
  ) => {
    const idArr = Array.isArray(id) ? id : [id];
    if (isEmpty(idArr)) return;
    const foldersMap = getFoldersMap();
    const itemIdToFolderIdMap = getItemIdToFolderIdMap();
    const itemIdToBinIdMap = getItemIdToBinIdMap();
    const binsMap = getBinsMap();
    const { foldersUpdates, binsUpdates } = idArr.reduce(
      (acc, spriteIdToRemove) => {
        const maybeAddFoldersUpdate = () => {
          if (!removeFromFolders) return;
          const folderId = itemIdToFolderIdMap[spriteIdToRemove];
          if (!folderId) return;
          const folder = foldersMap[folderId];
          if (!folder) return;
          const newItemIds = folder.itemIds.filter(
            (id) => id !== spriteIdToRemove,
          );
          if (newItemIds.length === folder.itemIds.length) return;
          acc.foldersUpdates[folder.id] = {
            folder,
            data: { itemIds: newItemIds },
          };
        };
        maybeAddFoldersUpdate();

        const maybeAddBinsUpdate = () => {
          if (!removeFromCustomBins) return;
          const parentBinId = itemIdToBinIdMap[spriteIdToRemove];
          if (!parentBinId) return;
          const bin = binsMap[parentBinId];
          if (!bin) return;
          const newItemIds = bin.itemIds.filter(
            (id) => id !== spriteIdToRemove,
          );
          if (newItemIds.length === bin.itemIds.length) return;
          acc.binsUpdates[bin.id] = {
            bin,
            data: { itemIds: newItemIds },
          };
        };
        maybeAddBinsUpdate();

        return acc;
      },
      {
        foldersUpdates: {},
        binsUpdates: {},
      } as {
        foldersUpdates: tUpdateFoldersArg;
        binsUpdates: tUpdateCustomBinsArg;
      },
    );
    const cmds: Command[] = [createRemoveSpritesCmd(id)];
    if (removeFromFolders && !isEmpty(foldersUpdates)) {
      cmds.push(createUpdateFoldersCmd(foldersUpdates));
    }
    if (removeFromCustomBins && !isEmpty(binsUpdates)) {
      cmds.push(createUpdateBinsCmd(binsUpdates));
    }
    await historyManager.execCommand(cmds);
  };
};
