import { useNormalizedFolders } from "@/folders/use-folders";
import type { tSprite as tItem } from "@/input/types";
import styles from "./styles.module.css";
import { useMemo, useRef } from "react";
import { type NodeRendererProps, Tree } from "react-arborist";
import { useTranslation } from "@/i18n/use-translation";
import { isRootFolder } from "@/folders/is-root-folder";
import { ItemNode, FolderNode, DefaultNode } from "./tree-node.component";
import type { tNodeData, tTreeNodeData, tTreeApi } from "./types";
import {
  withTreeViewport,
  type tTreeViewportProps,
} from "./with-tree-viewport.component";
import { useNodeSelectHandler } from "./use-node-select-handler";
import { TREE_ROW_HEIGHT } from "./config";
import { useNodesDeleteHandler } from "./use-nodes-delete-handler";
import { useContextMenuHandler } from "./use-context-menu-handler";
import { useMoveItems } from "@/folders/use-move-items";
import { usePackedSprites } from "@/packer/use-packed-sprites";
import { useRowRenderer } from "./use-row-renderer";

const FoldersList = ({ width, height }: tTreeViewportProps) => {
  const { t } = useTranslation();
  const folders = useNormalizedFolders();
  const treeApiRef = useRef<tTreeApi | undefined>(undefined);
  const { oversizedSprites } = usePackedSprites();
  const treeData: tTreeNodeData[] = useMemo(() => {
    const oversizedSpritesSet = new Set(oversizedSprites);
    return folders.map(({ folder, items }) => {
      const name = isRootFolder(folder)
        ? t("folders.default_folder_name")
        : folder.name;
      const nodeProps: tNodeData = {
        kind: "folder",
        items,
        folder,
      };
      const data: tTreeNodeData = {
        id: folder.id,
        name: name,
        nodeProps,
        children: items.map((item) => {
          const data: tTreeNodeData = {
            name: item.name,
            id: item.id,
            nodeProps: {
              kind: "item",
              item,
              isOversized: oversizedSpritesSet.has(item.id),
              folderId: folder.id,
            },
          };
          return data;
        }),
      };
      return data;
    });
  }, [folders, t, oversizedSprites]);
  const renderRow = useRowRenderer();
  const moveItems = useMoveItems();
  const onSelect = useNodeSelectHandler(treeApiRef.current);
  const onDelete = useNodesDeleteHandler();
  const onContextMenu = useContextMenuHandler(treeApiRef.current);
  return (
    <Tree
      ref={treeApiRef}
      openByDefault
      disableDrag={(v) => v.nodeProps.kind === "folder"}
      rowHeight={TREE_ROW_HEIGHT}
      className={styles.tree}
      data={treeData}
      width={width}
      height={height}
      renderRow={renderRow}
      onSelect={onSelect}
      onDelete={onDelete}
      onContextMenu={onContextMenu}
      onMove={(e) => {
        if (!e.parentNode) return;
        const targetIndex = e.index;
        const parentProps = e.parentNode.data.nodeProps;
        if (parentProps.kind !== "folder") return;
        const targetFolder = parentProps.folder;
        if (!targetFolder) return;
        const srcItems = e.dragNodes.reduce(
          (acc, node) => {
            if (node.data.nodeProps.kind === "item") {
              const folderId = node.data.nodeProps.folderId;
              if (folderId) {
                acc.push({
                  folderId,
                  item: node.data.nodeProps.item,
                });
              }
            }
            return acc;
          },
          [] as { item: tItem; folderId: string }[],
        );
        moveItems({
          srcItems,
          targetFolder,
          targetIndex,
        });
      }}
    >
      {Node}
    </Tree>
  );
};

function Node({ node, style, dragHandle }: NodeRendererProps<tTreeNodeData>) {
  const { nodeProps } = node.data;
  if (nodeProps.kind === "item") {
    return <ItemNode style={style} ref={dragHandle} item={nodeProps.item} />;
  } else if (nodeProps.kind === "folder") {
    return (
      <FolderNode
        style={style}
        ref={dragHandle}
        folder={nodeProps.folder}
        name={node.data.name}
      />
    );
  } else {
    return <DefaultNode style={style} ref={dragHandle} name={node.data.name} />;
  }
}

export default withTreeViewport(FoldersList);
