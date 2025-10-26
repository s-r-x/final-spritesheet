import type { tSprite as tItem } from "@/input/types";
import type { tFolder } from "@/folders/types";
import type { tNormalizedCustomBin } from "#custom-bins/types";
import type { TreeApi } from "react-arborist";

export type tItemNodeData = {
  kind: "item";
  folderId?: string;
  binId?: string;
  isOversized?: boolean;
  item: tItem;
};
export type tFolderNodeData = {
  kind: "folder";
  items: tItem[];
  folder: tFolder;
  binId?: string;
  isOversized?: boolean;
};

export type tCustomBinNodeData = {
  kind: "customBin";
  bin: tNormalizedCustomBin;
  itemsCount: number;
  oversizedCount?: number;
  isOversized?: boolean;
};
export type tBinNodeData = {
  kind: "bin";
  itemIds: string[];
  isOversized?: boolean;
};
export type tNodeData =
  | tItemNodeData
  | tFolderNodeData
  | tBinNodeData
  | tCustomBinNodeData;
export type tTreeNodeData<TNodeData extends tNodeData = tNodeData> = {
  id: string;
  name: string;
  nodeProps: TNodeData;
  children?: tTreeNodeData[];
};

export type tTreeApi = TreeApi<tTreeNodeData>;
