import type { tSprite } from "@/input/types";
import type { tFolder, tUpdateFolderData, tUpdateFoldersArg } from "./types";
import { isEmpty } from "#utils/is-empty";
import { isRootFolder } from "./is-root-folder";
import { useGetFoldersMap } from "./use-folders";
import { arrayMoveMultiple } from "#utils/array-move-multiple";
import type {
  tCustomBin,
  tUpdateCustomBinData,
  tUpdateCustomBinsArg,
} from "#custom-bins/types";
import {
  useGetCustomBinsMap,
  useGetItemIdToCustomBinIdMap,
} from "#custom-bins/use-custom-bins";
import { useCreateUpdateFoldersCommand } from "./use-update-folders";
import { useCreateUpdateCustomBinsCommand } from "#custom-bins/use-update-custom-bins";
import { useHistoryManager } from "@/history/use-history-manager";
import type { Command } from "@/common/commands/command";

export const useMoveItems = () => {
  const getFoldersMap = useGetFoldersMap();
  const getCustomBinsMap = useGetCustomBinsMap();
  const getItemIdToCustomBinIdMap = useGetItemIdToCustomBinIdMap();
  const createUpdateFoldersCmd = useCreateUpdateFoldersCommand();
  const createUpdateBinsCmd = useCreateUpdateCustomBinsCommand();
  const historyManager = useHistoryManager();
  return ({
    srcItems,
    targetFolder,
    targetIndex,
  }: {
    srcItems: { item: tSprite; folderId: string }[];
    targetFolder: tFolder;
    targetIndex: number;
  }) => {
    if (isEmpty(srcItems)) return;

    const foldersUpdates: tUpdateFoldersArg = {};
    const binsUpdates: tUpdateCustomBinsArg = {};
    const addFolderUpdate = (folder: tFolder, data: tUpdateFolderData) => {
      foldersUpdates[folder.id] = { folder, data };
    };
    const addBinUpdate = (bin: tCustomBin, data: tUpdateCustomBinData) => {
      binsUpdates[bin.id] = { bin, data };
    };
    const updateWithAccumulatedUpdates = () => {
      const cmds: Command[] = [];
      if (!isEmpty(foldersUpdates)) {
        cmds.push(createUpdateFoldersCmd(foldersUpdates));
      }
      if (!isEmpty(binsUpdates)) {
        cmds.push(createUpdateBinsCmd(binsUpdates));
      }
      if (!isEmpty(cmds)) {
        historyManager.execCommand(cmds);
      }
    };

    const cleanOldFolders = () => {
      const folderMap = getFoldersMap();
      for (const { item, folderId } of srcItems) {
        if (isRootFolder(folderId) || folderId === targetFolder.id) {
          continue;
        }
        const folder = folderMap[folderId];
        if (!folder) continue;

        if (!foldersUpdates[folderId]) {
          foldersUpdates[folderId] = {
            folder,
            data: { itemIds: folder.itemIds },
          };
        }
        addFolderUpdate(folder, {
          itemIds: foldersUpdates[folderId].data.itemIds!.filter(
            (id) => id !== item.id,
          ),
        });
      }
    };
    const syncCustomBins = () => {
      const itemIdToBinIdMap = getItemIdToCustomBinIdMap();
      const binsMap = getCustomBinsMap();
      for (const { item, folderId } of srcItems) {
        if (folderId === targetFolder.id) continue;
        if (!isRootFolder(folderId)) continue;
        const binId = itemIdToBinIdMap[item.id];
        if (!binId) continue;
        // the item is moving to a new folder from the root folder (e.g. no folder)
        // so there still might be a reference to that item in one of the bins' itemIds
        // need to clean it up
        const bin = binsMap[binId];
        if (!bin) continue;
        if (!binsUpdates[binId]) {
          binsUpdates[binId] = {
            bin,
            data: { itemIds: bin.itemIds },
          };
        }
        addBinUpdate(bin, {
          itemIds: binsUpdates[binId].data.itemIds!.filter(
            (id) => id !== item.id,
          ),
        });
      }
    };

    cleanOldFolders();
    syncCustomBins();

    if (isRootFolder(targetFolder)) {
      // dropped to the default folder which doesn't have ordering
      // we only have to remove from the old folders which is already done
      updateWithAccumulatedUpdates();
      return;
    }

    const insertIntoTargetFolder = () => {
      let targetFolderItemIds = [...targetFolder.itemIds];
      const indexesToMoveInsideSameFolder: number[] = [];
      const itemIdsToMoveFromOtherFolders: string[] = [];
      for (const { item } of srcItems) {
        const index = targetFolderItemIds.indexOf(item.id);
        const isSameFolder = index !== -1;
        if (isSameFolder && index === targetIndex) {
          continue;
        }
        if (isSameFolder) {
          indexesToMoveInsideSameFolder.push(index);
        } else {
          itemIdsToMoveFromOtherFolders.push(item.id);
        }
      }

      const hasUpdatesInSameFolder = !isEmpty(indexesToMoveInsideSameFolder);
      if (hasUpdatesInSameFolder) {
        targetFolderItemIds = arrayMoveMultiple(
          targetFolderItemIds,
          indexesToMoveInsideSameFolder,
          targetIndex,
        );
      }
      const hasUpdatesFromOtherFolders = !isEmpty(
        itemIdsToMoveFromOtherFolders,
      );
      if (hasUpdatesFromOtherFolders) {
        targetFolderItemIds.splice(
          targetIndex,
          0,
          ...itemIdsToMoveFromOtherFolders,
        );
      }
      if (hasUpdatesInSameFolder || hasUpdatesFromOtherFolders) {
        addFolderUpdate(targetFolder, { itemIds: targetFolderItemIds });
      }
    };

    insertIntoTargetFolder();

    updateWithAccumulatedUpdates();
  };
};
