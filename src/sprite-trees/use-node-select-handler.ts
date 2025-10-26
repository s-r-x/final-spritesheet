import type { NodeApi } from "react-arborist";
import type { tNodeData, tTreeApi, tTreeNodeData } from "./types";
import { isEmpty } from "#utils/is-empty";

export const useNodeSelectHandler = (treeApi: tTreeApi | undefined) => {
  return (nodes: NodeApi<tTreeNodeData<tNodeData>>[]) => {
    if (isEmpty(nodes) || !treeApi) return;
    const firstNode = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.level !== firstNode.level) {
        node.deselect();
      }
    }
  };
};
