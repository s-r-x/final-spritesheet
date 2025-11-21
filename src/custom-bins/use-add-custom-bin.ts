import { useHistoryManager } from "@/history/use-history-manager";
import { AddCustomBinCommand } from "./add-custom-bin.command";
import { generateId } from "#utils/generate-id";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tCustomBin } from "./types";
import {
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_DEFAULT_SQUARE,
} from "#config";

export const useAddCustomBin = () => {
  const historyManager = useHistoryManager();
  return async ({
    id = generateId(),
    name = generateUniqueName(),
    itemIds = [],
    folderIds = [],
    createdAt = new Date().toISOString(),
    useGlobalPackerOptions = true,
    packerPot = PACKER_DEFAULT_POT,
    packerAllowRotation = PACKER_DEFAULT_ALLOW_ROTATION,
    packerAlgorithm = PACKER_DEFAULT_ALGORITHM,
    packerSpritePadding = PACKER_DEFAULT_SPRITE_PADDING,
    packerSheetMaxSize = PACKER_DEFAULT_SHEET_SIZE,
    packerEdgeSpacing = PACKER_DEFAULT_EDGE_SPACING,
    packerSquare = PACKER_DEFAULT_SQUARE,
    ...rest
  }: Partial<Omit<tCustomBin, "projectId">> &
    Pick<tCustomBin, "projectId">) => {
    if (!rest.projectId) {
      throw new Error("no project id");
    }
    const command = new AddCustomBinCommand({
      bin: {
        id,
        name,
        itemIds,
        folderIds,
        createdAt,
        useGlobalPackerOptions,
        packerPot,
        packerSquare,
        packerAllowRotation,
        packerAlgorithm,
        packerSpritePadding,
        packerSheetMaxSize,
        packerEdgeSpacing,
        ...rest,
      },
    });
    await historyManager.execCommand(command);
  };
};
