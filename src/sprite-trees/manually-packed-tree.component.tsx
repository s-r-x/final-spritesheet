import styles from "./styles.module.css";
import { useMemo, useRef } from "react";
import type { tSprite } from "@/input/types";
import { useTranslation } from "@/i18n/use-translation";
import { usePackedSprites } from "@/packer/use-packed-sprites";
import { isEmpty } from "#utils/is-empty";
import { type NodeRendererProps, Tree, type TreeApi } from "react-arborist";
import {
  useGetCustomBinsMap,
  useNormalizedCustomBins,
} from "#custom-bins/use-custom-bins";
import type { tItemNodeData, tTreeNodeData, tFolderNodeData } from "./types";
import {
  type tTreeViewportProps,
  withTreeViewport,
} from "./with-tree-viewport.component";
import {
  ItemNode,
  BinNode,
  FolderNode,
  DefaultNode,
} from "./tree-node.component";
import { useNodeSelectHandler } from "./use-node-select-handler";
import { isDefaultBin } from "#custom-bins/is-default-bin";
import type {
  tCustomBin,
  tUpdateCustomBinData,
  tUpdateCustomBinsArg,
} from "#custom-bins/types";
import { useUpdateCustomBins } from "#custom-bins/use-update-custom-bins";
import { useRowRenderer } from "./use-row-renderer";
import { TREE_ROW_HEIGHT } from "./config";
import { sortBy } from "#utils/sort-by";
import { useNodesDeleteHandler } from "./use-nodes-delete-handler";
import { useContextMenuHandler } from "./use-context-menu-handler";

const ManuallyPackedTree = ({ width, height }: tTreeViewportProps) => {
  const customBins = useNormalizedCustomBins();
  const treeApiRef = useRef<TreeApi<tTreeNodeData> | undefined>(undefined);
  const { t } = useTranslation();
  const updateCustomBins = useUpdateCustomBins();
  const packed = usePackedSprites();
  const renderRow = useRowRenderer();
  const getCustomBinsMap = useGetCustomBinsMap();
  const treeData: tTreeNodeData[] = useMemo(() => {
    const root: tTreeNodeData[] = customBins.map((data) => {
      const oversizedSpritesSet = new Set<string>(
        packed.oversizedSpritesPerBin?.[data.bin.id] || [],
      );
      const packedBin = packed.bins.find((bin) => bin.id === data.bin.id);
      const generateItemChild = (
        item: tSprite,
        folderId?: string,
        binId?: string,
      ): tTreeNodeData<tItemNodeData> => ({
        id: item.id,
        name: item.name,
        nodeProps: {
          kind: "item",
          isOversized: oversizedSpritesSet.has(item.id),
          folderId,
          binId,
          item,
        },
      });
      const itemsChildren: tTreeNodeData<tItemNodeData>[] = data.items.map(
        (item) => generateItemChild(item, undefined, data.bin.id),
      );
      const foldersChildren: tTreeNodeData<tFolderNodeData>[] =
        data.folders.map(({ folder, items }) => {
          const name = folder.name;
          let isFolderOversized = false;
          const children = items.map((item) => {
            const child = generateItemChild(item, folder.id, data.bin.id);
            if (child.nodeProps.isOversized) {
              isFolderOversized = true;
            }
            return child;
          });

          return {
            id: folder.id,
            name,
            nodeProps: {
              kind: "folder",
              items,
              folder,
              binId: data.bin.id,
              isOversized: isFolderOversized,
            },
            children,
          };
        });
      return {
        id: data.bin.id,
        name: isDefaultBin(data.bin.id)
          ? t("default_custom_bin_name")
          : data.bin.name,
        nodeProps: {
          kind: "customBin",
          isOversized: oversizedSpritesSet.size > 0,
          oversizedCount: oversizedSpritesSet.size,
          itemsCount: packedBin?.sprites.length || 0,
          bin: data,
        },
        children: [
          ...sortBy(foldersChildren, (f) => f.name, "asc"),
          ...sortBy(itemsChildren, (i) => i.name, "asc"),
        ],
      };
    });
    return root;
  }, [customBins, packed, t]);
  const onSelect = useNodeSelectHandler(treeApiRef.current);
  const onDelete = useNodesDeleteHandler();
  const onContextMenu = useContextMenuHandler(treeApiRef.current);

  return (
    <Tree
      data={treeData}
      ref={treeApiRef}
      openByDefault
      disableDrop={(v) =>
        !v.parentNode || v.parentNode.data.nodeProps?.kind !== "customBin"
      }
      disableDrag={(v) =>
        v.nodeProps.kind === "customBin" ||
        (v.nodeProps.kind === "item" && !!v.nodeProps.folderId)
      }
      rowHeight={TREE_ROW_HEIGHT}
      className={styles.tree}
      width={width}
      height={height}
      renderRow={renderRow}
      onDelete={onDelete}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
      onMove={(e) => {
        if (!e.parentNode || isEmpty(e.dragNodes)) return;
        const parentProps = e.parentNode.data.nodeProps;
        if (parentProps.kind !== "customBin") return;
        const targetBin = parentProps.bin.bin;
        if (!targetBin) return;
        const targetBinId = targetBin.id;
        const binsMap = getCustomBinsMap();
        const binsUpdates: tUpdateCustomBinsArg = {};
        const addBinUpdate = (bin: tCustomBin, data: tUpdateCustomBinData) => {
          binsUpdates[bin.id] = { bin, data };
        };

        // key is the id of an old bin
        const entitiesToPullMap = new Map<
          string,
          {
            items: Set<string>;
            folders: Set<string>;
          }
        >();
        const itemsToInsert: string[] = [];
        const foldersToInsert: string[] = [];
        for (const node of e.dragNodes) {
          const nodeData = node.data.nodeProps;
          if (nodeData.kind !== "item" && nodeData.kind !== "folder") {
            continue;
          }
          const nodeId = node.id;
          const binId = nodeData.binId;
          const isSameBin = targetBinId === binId;
          if (!isSameBin) {
            if (nodeData.kind === "folder") {
              foldersToInsert.push(nodeId);
            } else if (nodeData.kind === "item") {
              itemsToInsert.push(nodeId);
            }
          }

          // no need to remove from the old bin
          if (!binId || isDefaultBin(binId) || isSameBin) continue;
          let pullEntry = entitiesToPullMap.get(binId);
          if (!pullEntry) {
            pullEntry = {
              folders: new Set(),
              items: new Set(),
            };
            entitiesToPullMap.set(binId, pullEntry);
          }
          if (nodeData.kind === "folder") {
            pullEntry.folders.add(nodeId);
          } else if (nodeData.kind === "item") {
            pullEntry.items.add(nodeId);
          }
        }
        if (entitiesToPullMap.size > 0) {
          for (const [
            binId,
            { items: itemsToPull, folders: foldersToPull },
          ] of entitiesToPullMap) {
            const bin = binsMap[binId];
            if (!bin) continue;
            addBinUpdate(bin, {
              ...(!isEmpty(itemsToPull) && {
                itemIds: bin.itemIds.filter((id) => !itemsToPull.has(id)),
              }),
              ...(!isEmpty(foldersToPull) && {
                folderIds: bin.folderIds.filter((id) => !foldersToPull.has(id)),
              }),
            });
          }
        }
        if (!isEmpty(itemsToInsert) || !isEmpty(foldersToInsert)) {
          if (targetBin) {
            addBinUpdate(targetBin, {
              ...(!isEmpty(itemsToInsert) && {
                itemIds: [...targetBin.itemIds, ...itemsToInsert],
              }),
              ...(!isEmpty(foldersToInsert) && {
                folderIds: [...targetBin.folderIds, ...foldersToInsert],
              }),
            });
          }
        }

        if (!isEmpty(binsUpdates)) {
          updateCustomBins(binsUpdates);
        }
      }}
    >
      {Node}
    </Tree>
  );
};

function Node({ node, style, dragHandle }: NodeRendererProps<tTreeNodeData>) {
  const { nodeProps } = node.data;
  if (nodeProps.kind === "item") {
    return (
      <ItemNode
        disableDrag={Boolean(nodeProps.folderId)}
        style={style}
        ref={dragHandle}
        item={nodeProps.item}
      />
    );
  } else if (nodeProps.kind === "customBin") {
    return (
      <BinNode
        style={style}
        ref={dragHandle}
        name={node.data.name}
        oversizedCount={nodeProps.oversizedCount}
        itemsCount={nodeProps.itemsCount}
        isOversized={(nodeProps.oversizedCount || 0) > 0}
      />
    );
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

export default withTreeViewport(ManuallyPackedTree);
