import { useRemoveSprites } from "@/input/use-remove-sprites";
import { isEmpty } from "#utils/is-empty";
import { useMutation } from "#hooks/use-mutation";
import type { NodeApi } from "react-arborist";
import type {
  tItemNodeData,
  tBinNodeData,
  tTreeNodeData,
  tFolderNodeData,
  tCustomBinNodeData,
} from "./types";
import { isDefaultBin } from "#custom-bins/is-default-bin";
import { useRemoveFolders } from "@/folders/use-remove-folders";
import { isRootFolder } from "@/folders/is-root-folder";
import { useRemoveCustomBins } from "#custom-bins/use-remove-custom-bins";

export const useRemoveItemNodes = () => {
  const removeSprites = useRemoveSprites();
  const removeSpriteMut = useMutation((id: string[]) => removeSprites(id));
  const removeItemNodes = (nodes: NodeApi<tTreeNodeData<tItemNodeData>>[]) => {
    const itemsToRemove = nodes.map((node) => node.id);
    if (!isEmpty(itemsToRemove)) {
      removeSpriteMut.mutate(itemsToRemove);
    }
  };
  return removeItemNodes;
};
export const useClearBinNodes = () => {
  const removeSprites = useRemoveSprites();
  const removeSpriteMut = useMutation((id: string[]) => removeSprites(id));
  const clearBinNodes = (nodes: NodeApi<tTreeNodeData<tBinNodeData>>[]) => {
    removeSpriteMut.mutate(
      nodes.flatMap((node) => node.data.nodeProps.itemIds),
    );
  };
  return clearBinNodes;
};
export const useRemoveFolderNodes = () => {
  const removeFolders = useRemoveFolders();
  const removeFoldersMut = useMutation(removeFolders);
  const removeFolderNodes = (
    nodes: NodeApi<tTreeNodeData<tFolderNodeData>>[],
  ) => {
    removeFoldersMut.mutate(
      nodes.filter((node) => !isRootFolder(node.id)).map((node) => node.id),
    );
  };
  return removeFolderNodes;
};
export const useRemoveCustomBinNodes = () => {
  const removeCustomBins = useRemoveCustomBins();
  const removeCustomBinsMut = useMutation(removeCustomBins);
  const removeCustomBinsNodes = (
    nodes: NodeApi<tTreeNodeData<tCustomBinNodeData>>[],
  ) => {
    removeCustomBinsMut.mutate(
      nodes.filter((node) => !isDefaultBin(node.id)).map((node) => node.id),
    );
  };
  return removeCustomBinsNodes;
};
