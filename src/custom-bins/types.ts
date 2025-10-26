import type { tFolder } from "@/folders/types";
import type { tSprite } from "@/input/types";

export type tCustomBin = {
  id: string;
  name: string;
  projectId: string;
  folderIds: string[];
  itemIds: string[];
  createdAt: string;
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
  Pick<tCustomBin, "name" | "itemIds" | "folderIds">
>;
export type tUpdateCustomBinsArg = Record<
  string,
  {
    bin: tCustomBin;
    data: tUpdateCustomBinData;
  }
>;
