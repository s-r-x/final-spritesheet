import type { tSprite } from "@/input/types";

export type tFolder = {
  id: string;
  name: string;
  projectId: string;
  itemIds: string[];
  isAnimation?: boolean;
  createdAt: string;
};
export type tFolderWithItems = {
  folder: tFolder;
  items: tSprite[];
};

export type tUpdateFolderData = Partial<
  Pick<tFolder, "name" | "itemIds" | "isAnimation">
>;
export type tUpdateFoldersArg = Record<
  string,
  {
    folder: tFolder;
    data: tUpdateFolderData;
  }
>;
