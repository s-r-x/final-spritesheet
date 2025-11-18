import type { tFolder } from "@/folders/types";
import type { tSprite } from "@/input/types";
import type { tPackerAlgorithm } from "@/packer/types";

export type tCustomBin = {
  id: string;
  name: string;
  projectId: string;
  folderIds: string[];
  itemIds: string[];
  createdAt: string;
  useGlobalPackerOptions: boolean;
  packerAlgorithm: tPackerAlgorithm;
  packerSheetMaxSize: number;
  packerSpritePadding: number;
  packerEdgeSpacing: number;
  packerPot: boolean;
  packerSquare: boolean;
  packerAllowRotation: boolean;
};
export type tNormalizedCustomBin = {
  bin: tCustomBin;
  items: tSprite[];
  folders: {
    folder: tFolder;
    items: tSprite[];
  }[];
};

export type tCustomBinsMap = Record<string, tCustomBin>;

export type tUpdateCustomBinData = Partial<
  Omit<tCustomBin, "id" | "projectId" | " createdAt">
>;
export type tUpdateCustomBinsArg = Record<
  string,
  {
    bin: tCustomBin;
    data: tUpdateCustomBinData;
  }
>;
