import { useNormalizedFolders } from "./use-folders-list";
import type { tSprite as tItem } from "@/input/types";
import type { tFolder, tUpdateFolderData, tUpdateFoldersArg } from "./types";
import styles from "./folders-list.module.css";
import { useUpdateFolders } from "./use-update-folders";
import { CSSProperties, forwardRef, useMemo, useRef } from "react";
import { Avatar, Button, ActionIcon } from "@mantine/core";
import {
  Folder as FolderIcon,
  Film as AnimationIcon,
  Plus as PlusIcon,
} from "lucide-react";
import {
  type NodeApi,
  type NodeRendererProps,
  Tree,
  type TreeApi,
} from "react-arborist";
import { useElementSize } from "@mantine/hooks";
import { isEmpty } from "#utils/is-empty";
import { arrayMoveMultiple } from "#utils/array-move-multiple";
import { useRemoveSprites } from "@/input/use-remove-sprites";
import { useRemoveFolders } from "./use-remove-folders";
import { useTranslation } from "@/i18n/use-translation";
import { isRootFolder } from "./is-root-folder";
import { useFocusSprite } from "@/canvas/use-focus-sprite";
import { isDefined } from "#utils/is-defined";
import { useOpenSpriteEditor } from "@/input/use-sprite-editor";
import { useContextMenu } from "@/common/context-menu/use-context-menu";
import { useAddFolder } from "./use-add-folder";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useAddSpritesFromFiles } from "@/input/use-add-sprites-from-files";
import { useFileDialog } from "@mantine/hooks";
import { useMutation } from "@/common/hooks/use-mutation";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";

type tItemNodeData = {
  kind: "item";
  props: tItemProps;
};
type tFolderNodeData = {
  kind: "folder";
  items: tItem[];
  props: tFolderProps;
};
type tNodeData = tItemNodeData | tFolderNodeData;
type tTreeNodeData<TNodeData extends tNodeData = tNodeData> = {
  id: string;
  name: string;
  nodeProps: TNodeData;
  children?: tTreeNodeData[];
};
const FoldersList = () => {
  const { t } = useTranslation();
  const uploadFilesTargetFolderRef = useRef<Maybe<string>>(null);
  const addSpritesFromFiles = useAddSpritesFromFiles();
  const addSpritesMut = useMutation(
    (files: File[]) => {
      const targetFolderId = uploadFilesTargetFolderRef.current;
      if (targetFolderId) {
        return addSpritesFromFiles({
          files,
          folder: folders.find((folder) => folder.folder.id === targetFolderId)
            ?.folder,
        });
      } else {
        return addSpritesFromFiles({ files });
      }
    },
    {
      onSuccess() {
        uploadFilesTargetFolderRef.current = null;
      },
      onError() {
        uploadFilesTargetFolderRef.current = null;
      },
    },
  );
  const fileDialog = useFileDialog({
    multiple: true,
    accept: SUPPORTED_SPRITE_MIME_TYPES.join(","),
    resetOnOpen: true,
    onChange(files) {
      if (!files || isEmpty(files)) return;
      addSpritesMut.mutate(Array.from(files));
    },
  });
  const folders = useNormalizedFolders();
  const updateFolders = useUpdateFolders();
  const addFolder = useAddFolder();
  const removeSprites = useRemoveSprites();
  const removeFolders = useRemoveFolders();
  const focusSprite = useFocusSprite();
  const openSpriteEditor = useOpenSpriteEditor();
  const { openContextMenu } = useContextMenu();
  const { ref, width: rootWidth, height: rootHeight } = useElementSize();
  const treeApiRef = useRef<TreeApi<tTreeNodeData> | undefined>(undefined);
  const treeData: tTreeNodeData[] = useMemo(() => {
    return folders.map(({ folder, items }) => {
      const nodeProps: tNodeData = {
        kind: "folder",
        items,
        props: { folder },
      };
      const data: tTreeNodeData = {
        id: folder.id,
        name: folder.name,
        nodeProps,
        children: items.map((item) => {
          const nodeProps: tNodeData = {
            kind: "item",
            props: { item, folderId: folder.id },
          };
          const data: tTreeNodeData = {
            name: item.name,
            id: item.id,
            nodeProps,
          };
          return data;
        }),
      };
      return data;
    });
  }, [folders]);
  const removeItemNodes = (nodes: NodeApi<tTreeNodeData<tItemNodeData>>[]) => {
    const itemsToRemove = nodes.map((node) => node.id);
    if (!isEmpty(itemsToRemove)) {
      removeSprites(itemsToRemove);
    }
  };
  const removeFolderNodes = (
    nodes: NodeApi<tTreeNodeData<tFolderNodeData>>[],
  ) => {
    removeFolders(nodes.map((node) => node.id));
  };
  const projectId = useActiveProjectId()!;
  const addFolderBtnLabel = t("folders.add_folder");
  return (
    <>
      <div className={styles.root}>
        <div className={styles.stickyHead}>
          <Button
            arial-label={addFolderBtnLabel}
            className={styles.wideViewportButton}
            fullWidth
            leftSection={<PlusIcon />}
            onClick={() => addFolder({ projectId })}
          >
            {addFolderBtnLabel}
          </Button>
          <ActionIcon
            arial-label={addFolderBtnLabel}
            className={styles.narrowViewportButton}
            onClick={() => addFolder({ projectId })}
          >
            <PlusIcon />
          </ActionIcon>
        </div>
        <div ref={ref} className={styles.treeRoot}>
          <div className={styles.treeViewport}>
            {rootWidth > 0 && rootHeight > 0 && (
              <Tree
                ref={treeApiRef}
                openByDefault
                disableDrag={(v) => v.nodeProps.kind === "folder"}
                rowHeight={30}
                className={styles.tree}
                data={treeData}
                width={rootWidth - 1}
                height={rootHeight - 1}
                renderRow={(args) => (
                  <div
                    {...args.attrs}
                    data-node-id={args.node.id}
                    ref={args.innerRef}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={args.node.handleClick}
                  >
                    {args.children}
                  </div>
                )}
                onSelect={(nodes) => {
                  const treeApi = treeApiRef.current;
                  if (isEmpty(nodes) || !treeApi) return;
                  const firstNode = nodes[0];
                  for (let i = 1; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level !== firstNode.level) {
                      node.deselect();
                    }
                  }
                }}
                onDelete={({ nodes }) => {
                  if (isEmpty(nodes)) return;
                  const nodeKind = nodes[0].data.nodeProps.kind;
                  if (nodeKind === "folder") {
                    removeFolderNodes(
                      nodes as NodeApi<tTreeNodeData<tFolderNodeData>>[],
                    );
                  } else {
                    removeItemNodes(
                      nodes as NodeApi<tTreeNodeData<tItemNodeData>>[],
                    );
                  }
                }}
                onMove={(e) => {
                  if (!e.parentNode) return;
                  const srcItems = e.dragNodes.reduce((acc, node) => {
                    if (node.data.nodeProps.kind === "item") {
                      acc.push(node.data.nodeProps.props);
                    }
                    return acc;
                  }, [] as tItemProps[]);
                  if (isEmpty(srcItems)) return;
                  const targetIndex = e.index;
                  const parentProps = e.parentNode.data.nodeProps;
                  if (parentProps.kind !== "folder") return;
                  const targetFolder = parentProps.props.folder;
                  if (!targetFolder) return;

                  const updates: tUpdateFoldersArg = {};
                  const addUpdate = (
                    folder: tFolder,
                    data: tUpdateFolderData,
                  ) => {
                    updates[folder.id] = { folder, data };
                  };
                  const updateFoldersWithAccumulatedUpdates = () => {
                    if (!isEmpty(updates)) {
                      updateFolders(updates);
                    }
                  };

                  const cleanOldFolders = () => {
                    const folderMap = new Map(
                      folders.map((f) => [f.folder.id, f.folder]),
                    );
                    for (const { item, folderId } of srcItems) {
                      if (
                        isRootFolder(folderId) ||
                        folderId === targetFolder.id
                      ) {
                        continue;
                      }
                      const folder = folderMap.get(folderId);
                      if (!folder) continue;

                      if (!updates[folderId]) {
                        updates[folderId] = {
                          folder,
                          data: { itemIds: folder.itemIds },
                        };
                      }
                      addUpdate(folder, {
                        itemIds: updates[folderId].data.itemIds!.filter(
                          (id) => id !== item.id,
                        ),
                      });
                    }
                  };

                  cleanOldFolders();

                  if (isRootFolder(targetFolder)) {
                    // dropped to the default folder which doesn't have ordering
                    // we need only to remove from the old folders which is already done
                    updateFoldersWithAccumulatedUpdates();
                    return;
                  }

                  const insertIntoTargetFolder = () => {
                    let targetFolderItemIds = [...targetFolder.itemIds];
                    const indexesToMoveInsideSameFolder: number[] = [];
                    const itemIdsToMoveFromOtherFolders: string[] = [];
                    for (const { item } of srcItems) {
                      const index = targetFolderItemIds.findIndex(
                        (id) => id === item.id,
                      );
                      const isSameFolder = index !== -1;
                      if (isSameFolder && index === targetIndex) {
                        continue;
                      }
                      if (isSameFolder) {
                        indexesToMoveInsideSameFolder.push(index);
                      } else {
                        itemIdsToMoveFromOtherFolders.push(item.id);
                      }
                    }

                    const hasUpdatesInSameFolder = !isEmpty(
                      indexesToMoveInsideSameFolder,
                    );
                    if (hasUpdatesInSameFolder) {
                      targetFolderItemIds = arrayMoveMultiple(
                        targetFolderItemIds,
                        indexesToMoveInsideSameFolder,
                        targetIndex,
                      );
                    }
                    const hasUpdatesFromOtherFolders = !isEmpty(
                      itemIdsToMoveFromOtherFolders,
                    );
                    if (hasUpdatesFromOtherFolders) {
                      targetFolderItemIds.splice(
                        targetIndex,
                        0,
                        ...itemIdsToMoveFromOtherFolders,
                      );
                    }
                    if (hasUpdatesInSameFolder || hasUpdatesFromOtherFolders) {
                      addUpdate(targetFolder, { itemIds: targetFolderItemIds });
                    }
                  };

                  insertIntoTargetFolder();

                  updateFoldersWithAccumulatedUpdates();
                }}
                onContextMenu={(e) => {
                  if (!(e?.target instanceof HTMLElement)) return;
                  const $node = e.target.closest("[data-node-id]");
                  const treeApi = treeApiRef.current;
                  if (!treeApi || !$node) return;
                  const id = $node.getAttribute("data-node-id");
                  if (!id) return;
                  const selectedIds = treeApi.selectedIds;

                  // select the node if it's not selected
                  if (!selectedIds.has(id)) {
                    const visibleNodes = treeApi.visibleNodes;
                    const node = visibleNodes.find((node) => node.id === id);
                    if (!node) return;
                    treeApi.select(node, { focus: true });
                  }
                  if (isEmpty(treeApi.selectedNodes)) return;

                  const selectedKind =
                    treeApi.selectedNodes[0].data.nodeProps.kind;
                  const isOnlyOneSelected = treeApi.selectedNodes.length === 1;

                  if (selectedKind === "folder") {
                    const selectedNodes = treeApi.selectedNodes as NodeApi<
                      tTreeNodeData<tFolderNodeData>
                    >[];
                    const firstFolder =
                      selectedNodes[0].data.nodeProps.props.folder;
                    const isOnlyRootSelected =
                      isOnlyOneSelected && isRootFolder(firstFolder);
                    const updateSelectedFolders = (data: tUpdateFolderData) => {
                      if (isEmpty(data)) return;
                      const updates: tUpdateFoldersArg = {};
                      for (const node of selectedNodes) {
                        const { folder } = node.data.nodeProps.props;
                        if (isRootFolder(folder)) continue;
                        updates[folder.id] = {
                          folder,
                          data,
                        };
                      }
                      updateFolders(updates);
                    };
                    const updateAnimationState = (isAnimation: boolean) => {
                      updateSelectedFolders({ isAnimation });
                    };
                    const isMarkedAsAnimation = selectedNodes.every(
                      (node) => node.data.nodeProps.props.folder.isAnimation,
                    );
                    const isOpened = selectedNodes.every((node) => node.isOpen);
                    const toggleOpenedState = () => {
                      for (const node of selectedNodes) {
                        if (isOpened) {
                          node.close();
                        } else {
                          node.open();
                        }
                      }
                    };
                    openContextMenu({
                      event: e,
                      items: [
                        isOnlyOneSelected && {
                          id: "add_sprites",
                          title: t("add_sprites"),
                          onClick: () => {
                            uploadFilesTargetFolderRef.current =
                              isOnlyRootSelected ? null : firstFolder.id;
                            fileDialog.open();
                          },
                        },
                        !isOnlyRootSelected &&
                          !isMarkedAsAnimation && {
                            id: "animation",
                            title: t("folders.mark_as_animation") + " (WIP)",
                            onClick: () => updateAnimationState(true),
                          },
                        !isOnlyRootSelected &&
                          isMarkedAsAnimation && {
                            id: "animation",
                            title: t("folders.unmark_as_animation") + " (WIP)",
                            onClick: () => updateAnimationState(false),
                          },
                        {
                          id: "delete",
                          title: t("remove"),
                          onClick: () => removeFolderNodes(selectedNodes),
                        },
                        {
                          id: "toggle",
                          title: t(
                            `folders.${isOpened ? "close_folder" : "open_folder"}`,
                          ),
                          onClick: toggleOpenedState,
                        },
                      ].filter(isDefined),
                    });
                  } else if (selectedKind === "item") {
                    const selectedNodes = treeApi.selectedNodes as NodeApi<
                      tTreeNodeData<tItemNodeData>
                    >[];
                    const firstItem =
                      selectedNodes[0].data.nodeProps.props.item;
                    openContextMenu({
                      event: e,
                      items: [
                        isOnlyOneSelected && {
                          id: "focus",
                          title: t("focus"),
                          onClick: () => focusSprite(firstItem.id),
                        },
                        isOnlyOneSelected && {
                          id: "update",
                          title: t("update"),
                          onClick: () => openSpriteEditor(firstItem.id),
                        },
                        {
                          id: "delete",
                          title: t("remove"),
                          onClick: () => {
                            removeItemNodes(selectedNodes);
                          },
                        },
                      ].filter(isDefined),
                    });
                  }
                }}
              >
                {Node}
              </Tree>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function Node({ node, style, dragHandle }: NodeRendererProps<tTreeNodeData>) {
  const { nodeProps } = node.data;
  if (nodeProps.kind === "item") {
    return (
      <Item
        style={style}
        ref={dragHandle}
        item={nodeProps.props.item}
        folderId={nodeProps.props.folderId}
      />
    );
  } else if (nodeProps.kind === "folder") {
    return (
      <Folder style={style} ref={dragHandle} folder={nodeProps.props.folder} />
    );
  } else {
    return (
      <div style={style} ref={dragHandle}>
        {node.isLeaf ? "🍁" : "🗀"}
        {node.data.name}
      </div>
    );
  }
}

type tFolderProps = {
  folder: tFolder;
  style?: CSSProperties;
};
const Folder = forwardRef<any, tFolderProps>(({ folder, style }, ref) => {
  const iconSize = 20;
  return (
    <div
      style={style}
      ref={ref}
      aria-label={folder.name}
      className={styles.folder}
    >
      {folder.isAnimation ? (
        <AnimationIcon size={iconSize} className={styles.folderIcon} />
      ) : (
        <FolderIcon size={iconSize} className={styles.folderIcon} />
      )}
      <span className={styles.nodeTitle}>{folder.name}</span>
    </div>
  );
});

type tItemProps = {
  item: tItem;
  folderId: string;
  style?: CSSProperties;
};
const Item = forwardRef<any, tItemProps>((props, ref) => {
  return (
    <div style={props.style} ref={ref} className={styles.item}>
      <Avatar
        imageProps={{ draggable: false }}
        src={props.item.url}
        radius="sm"
        size="sm"
      />
      <span className={styles.nodeTitle}>{props.item.name}</span>
    </div>
  );
});

export default FoldersList;
