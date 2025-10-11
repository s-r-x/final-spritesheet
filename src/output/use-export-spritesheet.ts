import {
  useGetPackedSprites,
  useHasAnyPackedSprites,
} from "@/packer/use-packed-sprites";
import { useGetOutputSettings } from "./use-output-settings";
import { exportSpritesheet } from "./export-spritesheet";
import { useCallback } from "react";
import { useGetActiveProjectName } from "@/projects/use-active-project-name";
import { useGetSpritesMap } from "@/input/use-sprites-map";

export const useIsExportSpritesheetDisabled = () => {
  const hasAnySprites = useHasAnyPackedSprites();
  return !hasAnySprites;
};

export const useExportSpritesheet = () => {
  const getPackedSprites = useGetPackedSprites();
  const getOutputSettings = useGetOutputSettings();
  const getProjectName = useGetActiveProjectName();
  const getSpritesMap = useGetSpritesMap();
  return useCallback(() => {
    const { bins: packedSprites } = getPackedSprites();
    const outputSettings = getOutputSettings();
    return exportSpritesheet({
      framework: outputSettings.framework,
      imageQuality: outputSettings.imageQuality,
      textureFormat: outputSettings.textureFormat,
      pngCompression: outputSettings.pngCompression,
      dataFileName: outputSettings.dataFileName,
      textureFileName: outputSettings.textureFileName,
      packedSprites,
      archiveName: getProjectName() || "archive",
      spritesMap: getSpritesMap(),
    });
  }, []);
};
