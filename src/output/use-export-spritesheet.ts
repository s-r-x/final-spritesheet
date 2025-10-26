import {
  useGetPackedSprites,
  useHasAnyPackedSprites,
} from "@/packer/use-packed-sprites";
import { useGetOutputSettings } from "./use-output-settings";
import { exportSpritesheet, type tAnimationsMap } from "./export-spritesheet";
import { useGetActiveProjectName } from "@/projects/use-active-project-name";
import { useGetSpritesMap } from "@/input/use-sprites-map";
import type { tPackedBin } from "@/packer/types";
import {
  useGetFoldersList,
  useGetFoldersMap,
  useGetItemIdToFolderIdMap,
} from "@/folders/use-folders";
import { isEmpty } from "#utils/is-empty";
import { invariant } from "#utils/invariant";

export const useIsExportSpritesheetDisabled = () => {
  const hasAnySprites = useHasAnyPackedSprites();
  return !hasAnySprites;
};

export const useExportSpritesheet = () => {
  const getPackedSprites = useGetPackedSprites();
  const getOutputSettings = useGetOutputSettings();
  const getProjectName = useGetActiveProjectName();
  const getSpritesMap = useGetSpritesMap();
  const collectAnimations = useCollectAnimations();
  return () => {
    const { bins } = getPackedSprites();
    const outputSettings = getOutputSettings();
    const animations = collectAnimations(bins);
    return exportSpritesheet({
      framework: outputSettings.framework,
      imageQuality: outputSettings.imageQuality,
      textureFormat: outputSettings.textureFormat,
      pngCompression: outputSettings.pngCompression,
      dataFileName: outputSettings.dataFileName,
      textureFileName: outputSettings.textureFileName,
      packedSprites: bins,
      archiveName: getProjectName() || "archive",
      spritesMap: getSpritesMap(),
      animations,
    });
  };
};

const useCollectAnimations = () => {
  const getFolders = useGetFoldersList();
  const getFoldersMap = useGetFoldersMap();
  const getSpritesMap = useGetSpritesMap();
  const getItemIdToFolderIdMap = useGetItemIdToFolderIdMap();
  return (bins: tPackedBin[]): tAnimationsMap | undefined => {
    if (isEmpty(bins)) return undefined;
    const folders = getFolders().filter((folder) => folder.isAnimation);
    if (isEmpty(folders)) return undefined;
    const itemIdToFolderIdMap = getItemIdToFolderIdMap();
    if (isEmpty(itemIdToFolderIdMap)) return undefined;
    const foldersMap = getFoldersMap();
    const spritesMap = getSpritesMap();
    const animations = bins.reduce((acc, { sprites, id: binId }) => {
      const animationsToComplete = new Map<string, Set<string>>();
      for (const sprite of sprites) {
        const folderId = itemIdToFolderIdMap[sprite.id];
        if (!folderId) {
          continue;
        }
        const folder = foldersMap[folderId];
        invariant(folder, `Folder ${folderId} is not in the folders map`);
        if (!folder.isAnimation || isEmpty(folder.itemIds)) continue;
        if (!animationsToComplete.has(folderId)) {
          animationsToComplete.set(folderId, new Set(folder.itemIds));
        }
        animationsToComplete.get(folderId)!.delete(sprite.id);
      }

      for (const [folderId, remainedEntries] of animationsToComplete) {
        // some of the animation entries are not in this bin, skipping
        if (!isEmpty(remainedEntries)) continue;
        const folder = foldersMap[folderId];
        const animationSequence = folder.itemIds.map((id) => {
          const sprite = spritesMap[id];
          invariant(sprite, `Sprite ${id} is not in the sprites map`);
          return sprite.name;
        });
        if (acc[binId]) {
          acc[binId][folder.name] = animationSequence;
        } else {
          acc[binId] = { [folder.name]: animationSequence };
        }
      }
      return acc;
    }, {} as tAnimationsMap);
    if (isEmpty(animations)) return undefined;
    return animations;
  };
};
