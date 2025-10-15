import styles from "./packed-sprites-list.module.css";
import { useFocusSprite } from "@/canvas/use-focus-sprite";
import {
  CSSProperties,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useContextMenu } from "@/common/context-menu/use-context-menu";
import { ActionIcon, Avatar } from "@mantine/core";
import type { tSprite } from "@/input/types";
import { useOpenSpriteEditor } from "@/input/use-sprite-editor";
import { FileButton, Button, Badge } from "@mantine/core";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useTranslation } from "@/i18n/use-translation";
import { useAddSpritesFromFilesMutation } from "@/input/use-add-sprites-from-files";
import { useRemoveSprites } from "@/input/use-remove-sprites";
import { usePackedSprites } from "./use-packed-sprites";
import { isEmpty } from "#utils/is-empty";
import {
  PackageCheck as PackageCheckIcon,
  PackageX as PackageFailIcon,
  Plus as PlusIcon,
} from "lucide-react";
import { useFocusBin } from "@/canvas/use-focus-bin";
import { isDefined } from "#utils/is-defined";
import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useCloseLeftPanelModal } from "@/layout/use-left-panel-modal";
import { useMutation } from "#hooks/use-mutation";
import { useSpritesMap } from "@/input/use-sprites-map";
import {
  type NodeApi,
  type NodeRendererProps,
  Tree,
  type TreeApi,
} from "react-arborist";
import clsx from "clsx";
import { useMeasure } from "#hooks/use-measure";

type tItemNodeData = {
  kind: "item";
  props: tItemProps;
};
type tBinNodeData = {
  kind: "bin";
  itemIds: string[];
  props: tBinProps;
};
type tNodeData = tItemNodeData | tBinNodeData;
type tTreeNodeData<TNodeData extends tNodeData = tNodeData> = {
  id: string;
  name: string;
  nodeProps: TNodeData;
  children?: tTreeNodeData[];
};
const PackedSpritesList = () => {
  const openSpriteEditor = useOpenSpriteEditor();
  const { openContextMenu } = useContextMenu();
  const { ref, width: rootWidth, height: rootHeight } = useMeasure();
  const treeApiRef = useRef<TreeApi<tTreeNodeData> | undefined>(undefined);
  const { t } = useTranslation();
  const isMobile = useIsMobileLayout();
  const closeLeftPanel = useCloseLeftPanelModal();
  const { bins, oversizedSprites } = usePackedSprites();
  const addSpritesFromFilesMut = useAddSpritesFromFilesMutation();
  const removeSprite = useRemoveSprites();
  const removeSpriteMut = useMutation((id: string | string[]) =>
    removeSprite(id),
  );
  const focusSprite_ = useFocusSprite();
  const focusSprite = useCallback(
    (id: string) => {
      focusSprite_(id);
      if (isMobile) {
        closeLeftPanel();
      }
    },
    [focusSprite_, isMobile, closeLeftPanel],
  );
  const focusBin_ = useFocusBin();
  const focusBin = useCallback(
    (idx: number) => {
      focusBin_(idx);
      if (isMobile) {
        closeLeftPanel();
      }
    },
    [focusBin_, isMobile, closeLeftPanel],
  );
  const spritesMap = useSpritesMap();
  const treeData: tTreeNodeData[] = useMemo(() => {
    const generateNodeData = ({
      index,
      isOversized,
      items,
    }: {
      index?: number;
      isOversized?: boolean;
      items: string[];
    }) => {
      const title = isOversized
        ? t("oversized_sprites")
        : t("packed_bin_with_id", { id: (index || 0) + 1 });
      const nodeProps: tNodeData = {
        kind: "bin",
        itemIds: items,
        props: { title, isOversized, itemsCount: items.length },
      };
      const data: tTreeNodeData = {
        id: isOversized ? "oversized" : String(index),
        name: title,
        nodeProps,
        children: items.map((itemId) => {
          const sprite = spritesMap[itemId];
          const nodeProps: tNodeData = {
            kind: "item",
            props: { item: sprite },
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
    const binsData = bins.map((bin, idx) =>
      generateNodeData({
        index: idx,
        items: bin.sprites.map((sprite) => sprite.id),
        isOversized: false,
      }),
    );
    if (!isEmpty(oversizedSprites)) {
      binsData.unshift(
        generateNodeData({ isOversized: true, items: oversizedSprites }),
      );
    }
    return binsData;
  }, [oversizedSprites, bins, spritesMap, t]);
  const removeItemNodes = (nodes: NodeApi<tTreeNodeData<tItemNodeData>>[]) => {
    const itemsToRemove = nodes.map((node) => node.id);
    if (!isEmpty(itemsToRemove)) {
      removeSpriteMut.mutate(itemsToRemove);
    }
  };
  const clearBinNodes = (nodes: NodeApi<tTreeNodeData<tBinNodeData>>[]) => {
    removeSpriteMut.mutate(
      nodes.map((node) => node.data.nodeProps.itemIds).flat(),
    );
  };

  const addSpritesBtnLabel = t("add_sprites");
  return (
    <>
      <div className={styles.root}>
        <div className={styles.stickyHead}>
          <FileButton
            onChange={(files) => {
              addSpritesFromFilesMut.mutate({ files });
            }}
            accept={SUPPORTED_SPRITE_MIME_TYPES.join(",")}
            multiple
          >
            {(props) => (
              <>
                <Button
                  className={styles.wideViewportButton}
                  aria-label={addSpritesBtnLabel}
                  leftSection={<PlusIcon />}
                  fullWidth
                  {...props}
                >
                  {addSpritesBtnLabel}
                </Button>
                <ActionIcon
                  className={styles.narrowViewportButton}
                  aria-label={addSpritesBtnLabel}
                  {...props}
                >
                  <PlusIcon />
                </ActionIcon>
              </>
            )}
          </FileButton>
        </div>
        <div ref={ref} className={styles.treeRoot}>
          <div
            className={styles.treeViewport}
            data-testid="packed-sprites-tree-viewport"
          >
            {rootWidth > 0 && rootHeight > 0 && (
              <Tree
                data={treeData}
                ref={treeApiRef}
                openByDefault
                disableDrag
                rowHeight={30}
                className={styles.tree}
                width={rootWidth - 1}
                height={rootHeight - 1}
                data-testid="true"
                renderRow={(args) => (
                  <div
                    {...args.attrs}
                    className={clsx(
                      styles.treeRow,
                      args.node.id === "oversized" && styles.oversized,
                    )}
                    data-node-id={args.node.id}
                    ref={args.innerRef}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={args.node.handleClick}
                  >
                    {args.children}
                  </div>
                )}
                onDelete={({ nodes }) => {
                  if (isEmpty(nodes)) return;
                  const nodeKind = nodes[0].data.nodeProps.kind;
                  if (nodeKind === "bin") {
                    clearBinNodes(
                      nodes as NodeApi<tTreeNodeData<tBinNodeData>>[],
                    );
                  } else {
                    removeItemNodes(
                      nodes as NodeApi<tTreeNodeData<tItemNodeData>>[],
                    );
                  }
                }}
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

                  if (selectedKind === "bin") {
                    const selectedNodes = treeApi.selectedNodes as NodeApi<
                      tTreeNodeData<tBinNodeData>
                    >[];
                    const firstFolder = selectedNodes[0];
                    const isOpened = selectedNodes.every((node) => node.isOpen);
                    const isOversizedSelected = firstFolder.id === "oversized";
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
                        isOnlyOneSelected &&
                          !isOversizedSelected && {
                            id: "focus_bin",
                            title: t("focus"),
                            onClick: () => focusBin(Number(firstFolder.id)),
                          },
                        {
                          id: "clear_bin",
                          title: t("clear_packed_bin"),
                          onClick: () => clearBinNodes(selectedNodes),
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
    return <Item style={style} ref={dragHandle} item={nodeProps.props.item} />;
  } else if (nodeProps.kind === "bin") {
    return <Bin style={style} ref={dragHandle} {...nodeProps.props} />;
  } else {
    return (
      <div style={style} ref={dragHandle}>
        {node.isLeaf ? "🍁" : "🗀"}
        {node.data.name}
      </div>
    );
  }
}

type tBinProps = {
  title: string;
  isOversized?: boolean;
  itemsCount: number;
  style?: CSSProperties;
};
const Bin = forwardRef<any, tBinProps>(
  ({ title, style, isOversized, itemsCount }, ref) => {
    const iconSize = 20;
    return (
      <div style={style} ref={ref} aria-label={title} className={styles.bin}>
        {isOversized ? (
          <PackageFailIcon size={iconSize} className={styles.binIcon} />
        ) : (
          <PackageCheckIcon size={iconSize} className={styles.binIcon} />
        )}
        <span className={styles.nodeTitle}>{title}</span>
        <Badge
          className={styles.itemsCount}
          color="gray"
          size="sm"
          circle={itemsCount < 10}
        >
          {itemsCount}
        </Badge>
      </div>
    );
  },
);

type tItemProps = {
  item: tSprite;
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

export default memo(PackedSpritesList);
