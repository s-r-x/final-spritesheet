import type { TreeProps } from "react-arborist/dist/module/types/tree-props";
import type { tUpdateFolderData, tUpdateFoldersArg } from "@/folders/types";
import type { NodeApi } from "react-arborist";
import { isEmpty } from "#utils/is-empty";
import { isRootFolder } from "@/folders/is-root-folder";
import { isDefined } from "#utils/is-defined";
import { sortBy } from "#utils/sort-by";
import type {
  tItemNodeData,
  tFolderNodeData,
  tTreeNodeData,
  tTreeApi,
  tBinNodeData,
  tCustomBinNodeData,
} from "./types";
import { useContextMenu } from "@/common/context-menu/use-context-menu";
import { useUpdateFolders } from "@/folders/use-update-folders";
import { useRef } from "react";
import { useFileDialog } from "@mantine/hooks";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useAddSpritesFromFiles } from "@/input/use-add-sprites-from-files";
import { useMutation } from "#hooks/use-mutation";
import { useGetFoldersMap } from "@/folders/use-folders";
import { invariant } from "#utils/invariant";
import { useTranslation } from "@/i18n/use-translation";
import { useOpenFolderEditor } from "@/folders/use-folder-editor";
import {
  useClearBinNodes,
  useRemoveCustomBinNodes,
  useRemoveFolderNodes,
  useRemoveItemNodes,
} from "./use-nodes-mutations";
import { useFocusSpriteOnCanvas } from "./use-focus-sprite-on-canvas";
import { useOpenSpriteEditor } from "@/input/use-sprite-editor";
import { useFocusBinOnCanvas } from "./use-focus-bin-on-canvas";
import { useOpenCustomBinEditor } from "#custom-bins/use-custom-bin-editor";
import { isDefaultBin } from "#custom-bins/is-default-bin";
import { useOpenAnimationPreview } from "@/animation-preview/use-animation-preview";

export const useContextMenuHandler = (treeApi: tTreeApi | undefined) => {
  const { t } = useTranslation();
  const addSpritesFromFiles = useAddSpritesFromFiles();
  const getFoldersMap = useGetFoldersMap();
  const openFolderEditor = useOpenFolderEditor();
  const openSpriteEditor = useOpenSpriteEditor();
  const openCustomBinEditor = useOpenCustomBinEditor();
  const openAnimationPreview = useOpenAnimationPreview();
  const removeItemNodes = useRemoveItemNodes();
  const removeFolderNodes = useRemoveFolderNodes();
  const removeCustomBinNodes = useRemoveCustomBinNodes();
  const clearBinNodes = useClearBinNodes();
  const focusSprite = useFocusSpriteOnCanvas();
  const focusBin = useFocusBinOnCanvas();
  const addSpritesMut = useMutation(
    (files: File[]) => {
      const targetFolderId = uploadFilesTargetFolderRef.current;
      if (targetFolderId) {
        const folder = getFoldersMap()[targetFolderId];
        invariant(folder, "folder not found");
        return addSpritesFromFiles({
          files,
          folder,
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
  const { openContextMenu } = useContextMenu();
  const updateFolders = useUpdateFolders();
  const uploadFilesTargetFolderRef = useRef<Maybe<string>>(null);
  const handler: TreeProps<tTreeNodeData>["onContextMenu"] = (e) => {
    if (!(e?.target instanceof HTMLElement)) return;
    const $node = e.target.closest("[data-node-id]");
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

    const selectedKind = treeApi.selectedNodes[0].data.nodeProps.kind;
    const isOnlyOneSelected = treeApi.selectedNodes.length === 1;
    const areAllNodesOpened = treeApi.selectedNodes.every(
      (node) => node.isOpen,
    );
    const toggleOpenedState = () => {
      for (const node of treeApi.selectedNodes) {
        if (areAllNodesOpened) {
          node.close();
        } else {
          node.open();
        }
      }
    };

    if (selectedKind === "folder") {
      const selectedNodes = treeApi.selectedNodes as NodeApi<
        tTreeNodeData<tFolderNodeData>
      >[];
      const firstFolder = selectedNodes[0].data.nodeProps.folder;
      const isRootSelected = selectedNodes.some((node) =>
        isRootFolder(node.data.nodeProps.folder),
      );
      const isOnlyRootSelected = isOnlyOneSelected && isRootSelected;
      const isMarkedAsAnimation = selectedNodes.every(
        (node) => node.data.nodeProps.folder.isAnimation,
      );

      const updateSelectedFolders = (data: tUpdateFolderData) => {
        if (isEmpty(data)) return;
        const updates: tUpdateFoldersArg = {};
        for (const node of selectedNodes) {
          const { folder } = node.data.nodeProps;
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
      const applyItemsSort = (field: "name", order: "asc" | "desc") => {
        const updates: tUpdateFoldersArg = {};
        for (const node of selectedNodes) {
          const items = node.data.nodeProps.items;
          if (isEmpty(items)) continue;
          const { folder } = node.data.nodeProps;
          const sortedItems = sortBy(items, (item) => item[field], order);
          updates[folder.id] = {
            folder,
            data: {
              itemIds: sortedItems.map((item) => item.id),
            },
          };
        }
        updateFolders(updates);
      };

      const canUnmarkAsAnimation = !isOnlyRootSelected && isMarkedAsAnimation;
      const canMarkAsAnimation = !isOnlyRootSelected && !isMarkedAsAnimation;
      const canOpenAnimationPreview =
        isOnlyOneSelected && firstFolder?.isAnimation;
      const canUpdate = isOnlyOneSelected && !isOnlyRootSelected;
      const canApplySort =
        !isRootSelected &&
        selectedNodes.some((node) => !isEmpty(node.data.children));
      const canAddSprites = isOnlyOneSelected;
      const sortAscSymbol = "⬇️";
      const sortDescSymbol = "⬆️";
      const canRemove = !isRootSelected;
      openContextMenu({
        event: e,
        items: [
          canAddSprites && {
            id: "add_sprites",
            title: t("add_sprites"),
            onClick: () => {
              uploadFilesTargetFolderRef.current = isOnlyRootSelected
                ? null
                : firstFolder.id;
              fileDialog.open();
            },
          },
          canUpdate && {
            id: "update_folder",
            title: t("update"),
            onClick: () => openFolderEditor(firstFolder.id),
          },
          canOpenAnimationPreview && {
            id: "animation_preview",
            title: t("folders.open_animation_preview"),
            onClick: () => openAnimationPreview(firstFolder.id),
          },
          canMarkAsAnimation && {
            id: "animation",
            title: t("folders.mark_as_animation"),
            onClick: () => updateAnimationState(true),
          },
          canApplySort && {
            id: "apply_sort",
            title: t("folders.apply_sort"),
            children: [
              {
                id: "items_sort_name_asc",
                title: t("folders.sort_opt_name") + " " + sortAscSymbol,
                onClick: () => applyItemsSort("name", "asc"),
              },
              {
                id: "items_sort_name_desc",
                title: t("folders.sort_opt_name") + " " + sortDescSymbol,
                onClick: () => applyItemsSort("name", "desc"),
              },
            ],
          },
          canUnmarkAsAnimation && {
            id: "animation",
            title: t("folders.unmark_as_animation"),
            onClick: () => updateAnimationState(false),
          },
          canRemove && {
            id: "delete",
            title: t("remove"),
            onClick: () => removeFolderNodes(selectedNodes),
          },
          {
            id: "toggle",
            title: t(
              `folders.${areAllNodesOpened ? "close_folder" : "open_folder"}`,
            ),
            onClick: toggleOpenedState,
          },
        ].filter(isDefined),
      });
    } else if (selectedKind === "item") {
      const selectedNodes = treeApi.selectedNodes as NodeApi<
        tTreeNodeData<tItemNodeData>
      >[];
      const firstItem = selectedNodes[0].data.nodeProps.item;
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
            onClick: () => removeItemNodes(selectedNodes),
          },
        ].filter(isDefined),
      });
    } else if (selectedKind === "bin") {
      const selectedNodes = treeApi.selectedNodes as NodeApi<
        tTreeNodeData<tBinNodeData>
      >[];

      const firstBin = selectedNodes[0];
      const isOversizedSelected = firstBin.id === "oversized";
      openContextMenu({
        event: e,
        items: [
          isOnlyOneSelected &&
            !isOversizedSelected && {
              id: "focus_bin",
              title: t("focus"),
              onClick: () => focusBin(firstBin.id),
            },
          {
            id: "clear_bin",
            title: t("clear_packed_bin"),
            onClick: () => clearBinNodes(selectedNodes),
          },
          {
            id: "toggle",
            title: t(
              `folders.${areAllNodesOpened ? "close_folder" : "open_folder"}`,
            ),
            onClick: toggleOpenedState,
          },
        ].filter(isDefined),
      });
    } else if (selectedKind === "customBin") {
      const selectedNodes = treeApi.selectedNodes as NodeApi<
        tTreeNodeData<tCustomBinNodeData>
      >[];
      const isRootSelected = selectedNodes.some((node) =>
        isDefaultBin(node.data.nodeProps.bin.bin),
      );
      openContextMenu({
        event: e,
        items: [
          isOnlyOneSelected && {
            id: "focus_bin",
            title: t("focus"),
            onClick: () =>
              focusBin(selectedNodes[0]!.data.nodeProps.bin.bin.id),
          },
          isOnlyOneSelected &&
            !isRootSelected && {
              id: "update",
              title: t("update"),
              onClick: () =>
                openCustomBinEditor(
                  selectedNodes[0]!.data.nodeProps.bin.bin.id,
                ),
            },
          !isRootSelected && {
            id: "remove",
            title: t("remove"),
            onClick: () => removeCustomBinNodes(selectedNodes),
          },
          {
            id: "toggle",
            title: t(
              `folders.${areAllNodesOpened ? "close_folder" : "open_folder"}`,
            ),
            onClick: toggleOpenedState,
          },
        ].filter(isDefined),
      });
    }
  };
  return handler;
};
