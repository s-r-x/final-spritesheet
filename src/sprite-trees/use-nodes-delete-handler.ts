import type { TreeProps } from "react-arborist/dist/module/types/tree-props";
import { isEmpty } from "#utils/is-empty";
import type { NodeApi } from "react-arborist";
import type {
  tItemNodeData,
  tBinNodeData,
  tTreeNodeData,
  tFolderNodeData,
  tCustomBinNodeData,
} from "./types";
import {
  useClearBinNodes,
  useRemoveCustomBinNodes,
  useRemoveFolderNodes,
  useRemoveItemNodes,
} from "./use-nodes-mutations";

export const useNodesDeleteHandler = () => {
  const removeItemNodes = useRemoveItemNodes();
  const clearBinNodes = useClearBinNodes();
  const removeFolderNodes = useRemoveFolderNodes();
  const removeCustomBinsNodes = useRemoveCustomBinNodes();
  const handler: TreeProps<tTreeNodeData>["onDelete"] = ({ nodes }) => {
    if (isEmpty(nodes)) return;
    const nodeKind = nodes[0].data.nodeProps.kind;
    if (nodeKind === "bin") {
      clearBinNodes(nodes as NodeApi<tTreeNodeData<tBinNodeData>>[]);
    } else if (nodeKind === "customBin") {
      removeCustomBinsNodes(
        nodes as NodeApi<tTreeNodeData<tCustomBinNodeData>>[],
      );
    } else if (nodeKind === "item") {
      removeItemNodes(nodes as NodeApi<tTreeNodeData<tItemNodeData>>[]);
    } else if (nodeKind === "folder") {
      removeFolderNodes(nodes as NodeApi<tTreeNodeData<tFolderNodeData>>[]);
    }
  };
  return handler;
};
