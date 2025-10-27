import styles from "./styles.module.css";
import { memo, useMemo, useRef } from "react";
import { useTranslation } from "@/i18n/use-translation";
import { isEmpty } from "#utils/is-empty";
import { useSpritesMap } from "@/input/use-sprites-map";
import { type NodeRendererProps, Tree, type TreeApi } from "react-arborist";
import { usePackedSprites } from "@/packer/use-packed-sprites";
import type { tNodeData, tTreeNodeData } from "./types";
import { ItemNode, BinNode, DefaultNode } from "./tree-node.component";
import {
  withTreeViewport,
  type tTreeViewportProps,
} from "./with-tree-viewport.component";
import { useNodeSelectHandler } from "./use-node-select-handler";
import { useRowRenderer } from "./use-row-renderer";
import { TREE_ROW_HEIGHT } from "./config";
import { useNodesDeleteHandler } from "./use-nodes-delete-handler";
import { useContextMenuHandler } from "./use-context-menu-handler";

const PackedSpritesTree = ({ width, height }: tTreeViewportProps) => {
  const treeApiRef = useRef<TreeApi<tTreeNodeData> | undefined>(undefined);
  const { t } = useTranslation();
  const renderRow = useRowRenderer();
  const { bins, oversizedSprites } = usePackedSprites();
  const spritesMap = useSpritesMap();
  const treeData: tTreeNodeData[] = useMemo(() => {
    const generateNodeData = ({
      id,
      items,
    }: {
      id: string;
      items: string[];
    }) => {
      const isOversized = id === "oversized";
      const title = isOversized
        ? t("oversized_sprites")
        : t("packed_bin_with_id", { id: (Number(id) || 0) + 1 });
      const nodeProps: tNodeData = {
        kind: "bin",
        itemIds: items,
        isOversized,
      };
      const data: tTreeNodeData = {
        id,
        name: title,
        nodeProps,
        children: items.map((itemId) => {
          const sprite = spritesMap[itemId];
          const nodeProps: tNodeData = {
            kind: "item",
            item: sprite,
            isOversized,
            binId: id,
          };
          const data: tTreeNodeData = {
            name: sprite.name,
            id: itemId,
            nodeProps,
          };
          return data;
        }),
      };
      return data;
    };
    const binsData = bins.map((bin) =>
      generateNodeData({
        id: bin.id,
        items: bin.sprites.map((sprite) => sprite.id),
      }),
    );
    if (!isEmpty(oversizedSprites)) {
      binsData.unshift(
        generateNodeData({
          items: oversizedSprites,
          id: "oversized",
        }),
      );
    }
    return binsData;
  }, [oversizedSprites, bins, spritesMap, t]);
  const onSelect = useNodeSelectHandler(treeApiRef.current);
  const onDelete = useNodesDeleteHandler();
  const onContextMenu = useContextMenuHandler(treeApiRef.current);

  return (
    <Tree
      data={treeData}
      ref={treeApiRef}
      openByDefault
      rowHeight={TREE_ROW_HEIGHT}
      className={styles.tree}
      width={width}
      height={height}
      renderRow={renderRow}
      onDelete={onDelete}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
    >
      {Node}
    </Tree>
  );
};

function Node({ node, style, dragHandle }: NodeRendererProps<tTreeNodeData>) {
  const { nodeProps } = node.data;
  if (nodeProps.kind === "item") {
    return <ItemNode style={style} ref={dragHandle} item={nodeProps.item} />;
  } else if (nodeProps.kind === "bin") {
    const { isOversized } = nodeProps;
    const itemsCount = nodeProps.itemIds.length;
    return (
      <BinNode
        style={style}
        ref={dragHandle}
        isOversized={isOversized}
        name={node.data.name}
        oversizedCount={isOversized ? itemsCount : 0}
        itemsCount={isOversized ? 0 : itemsCount}
      />
    );
  } else {
    return <DefaultNode style={style} ref={dragHandle} name={node.data.name} />;
  }
}

export default memo(withTreeViewport(PackedSpritesTree));
