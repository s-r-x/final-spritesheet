import { useHistoryManager } from "@/history/use-history-manager";
import type { tFolder } from "./types";
import { RemoveFoldersCommand } from "./remove-folders.command";
import { useCreateRemoveSpritesCommand } from "@/input/use-remove-sprites";
import type { Command } from "@/common/commands/command";
import { isEmpty } from "#utils/is-empty";
import { isRootFolder } from "./is-root-folder";
import { useCreateUpdateCustomBinsCommand } from "#custom-bins/use-update-custom-bins";
import {
  useGetCustomBinsMap,
  useGetFolderIdToCustomBinIdMap,
} from "#custom-bins/use-custom-bins";
import type { tUpdateCustomBinsArg } from "#custom-bins/types";
import { useGetFoldersMap } from "./use-folders";

export const useRemoveFolders = () => {
  const historyManager = useHistoryManager();
  const createRemoveSpritesCommand = useCreateRemoveSpritesCommand();
  const createUpdateCustomBinsCmd = useCreateUpdateCustomBinsCommand();
  const getCustomBinsMap = useGetCustomBinsMap();
  const getFolderIdToCustomBinIdMap = useGetFolderIdToCustomBinIdMap();
  const getFoldersMap = useGetFoldersMap();
  return async (id: string | string[]) => {
    const foldersMap = getFoldersMap();
    const binsMap = getCustomBinsMap();
    const folderIdToBinIdMap = getFolderIdToCustomBinIdMap();
    const {
      folders: foldersToRemove,
      sprites: spriteIdsToRemove,
      binsUpdates,
    } = (Array.isArray(id) ? id : [id]).reduce(
      (acc, folderIdToRemove) => {
        // shouldn't be here
        if (isRootFolder(folderIdToRemove)) return acc;
        const folder = foldersMap[folderIdToRemove];
        if (!folder) return acc;
        acc.folders.push(folder);
        if (!isEmpty(folder.itemIds)) {
          acc.sprites.push(...folder.itemIds);
        }
        const parentBinId = folderIdToBinIdMap[folder.id];
        if (!parentBinId) return acc;
        const bin = binsMap[parentBinId];
        if (!bin) return acc;
        const newFolderIds = bin.folderIds.filter(
          (folderId) => folderId !== folderIdToRemove,
        );
        if (newFolderIds.length !== bin.folderIds.length) {
          acc.binsUpdates[bin.id] = {
            bin,
            data: { folderIds: newFolderIds },
          };
        }
        return acc;
      },
      { folders: [], sprites: [], binsUpdates: {} } as {
        folders: tFolder[];
        sprites: string[];
        binsUpdates: tUpdateCustomBinsArg;
      },
    );
    const cmds: Command[] = [];
    if (!isEmpty(foldersToRemove)) {
      cmds.push(new RemoveFoldersCommand({ folders: foldersToRemove }));
    }
    if (!isEmpty(spriteIdsToRemove)) {
      cmds.push(createRemoveSpritesCommand(spriteIdsToRemove));
    }
    if (!isEmpty(binsUpdates)) {
      cmds.push(createUpdateCustomBinsCmd(binsUpdates));
    }
    if (!isEmpty(cmds)) {
      await historyManager.execCommand(cmds);
    }
  };
};
