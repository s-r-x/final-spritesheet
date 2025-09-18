import styles from "./toolbar.module.css";
import { FileButton, Button, Group, ActionIcon } from "@mantine/core";
import {
  Plus as PlusIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  List as ListIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  Save as SaveIcon,
} from "lucide-react";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useAddSpritesFromFiles } from "@/sprites/use-add-sprites-from-files";
import {
  useExportSpritesheet,
  useIsExportSpritesheetDisabled,
} from "@/output/use-export-spritesheet";
import { useTranslation } from "@/i18n/use-translation";
import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useRightPanelModal } from "@/layout/use-right-panel-modal";
import { useLeftPanelModal } from "@/layout/use-left-panel-modal";
import { useCanUndo, useUndo } from "@/history/use-undo";
import { useCanRedo, useRedo } from "@/history/use-redo";
import {
  useHasUnsavedChanges,
  useIsPersisting,
  usePersistChanges,
} from "@/persistence/use-persistence";

const Toolbar = () => {
  const { t } = useTranslation();
  const addSprites = useAddSpritesFromFiles();
  const exportSpritesheet = useExportSpritesheet();
  const isMobile = useIsMobileLayout();
  const openLeftPanel = useLeftPanelModal();
  const openRightPanel = useRightPanelModal();
  const addSpritesLabel = t("add_sprites");
  const exportLabel = t("export");
  const canUndo = useCanUndo();
  const undo = useUndo();
  const canRedo = useCanRedo();
  const redo = useRedo();
  const canPersist = useHasUnsavedChanges();
  const isPersisting = useIsPersisting();
  const persistChanges = usePersistChanges();
  const isExportDisabled = useIsExportSpritesheetDisabled();
  return (
    <div className={styles.root}>
      <Group gap="xs">
        <FileButton
          onChange={(files) => {
            addSprites(files);
          }}
          accept={SUPPORTED_SPRITE_MIME_TYPES.join(",")}
          multiple
        >
          {(props) =>
            isMobile ? (
              <ActionIcon size="lg" aria-label={addSpritesLabel} {...props}>
                <PlusIcon />
              </ActionIcon>
            ) : (
              <Button
                size="sm"
                variant="filled"
                {...props}
                aria-label={addSpritesLabel}
                leftSection={<PlusIcon size={20} />}
                disabled={isPersisting}
              >
                {addSpritesLabel}
              </Button>
            )
          }
        </FileButton>
        <ActionIcon
          onClick={undo}
          disabled={!canUndo || isPersisting}
          size="lg"
          aria-label={t("undo")}
        >
          <UndoIcon />
        </ActionIcon>
        <ActionIcon
          onClick={redo}
          disabled={!canRedo || isPersisting}
          size="lg"
          aria-label={t("redo")}
        >
          <RedoIcon />
        </ActionIcon>
        {isMobile && (
          <ActionIcon
            aria-label={t("settings")}
            size="lg"
            onClick={openRightPanel}
          >
            <SettingsIcon />
          </ActionIcon>
        )}
        {isMobile && (
          <ActionIcon
            aria-label={t("sprites_list")}
            size="lg"
            onClick={openLeftPanel}
          >
            <ListIcon />
          </ActionIcon>
        )}
        <ActionIcon
          disabled={!canPersist}
          aria-label={t("save")}
          onClick={persistChanges}
          loading={isPersisting}
          variant="light"
          size="lg"
        >
          <SaveIcon />
        </ActionIcon>
        <Button
          variant="light"
          leftSection={<DownloadIcon size={20} />}
          size="sm"
          onClick={exportSpritesheet}
          disabled={isExportDisabled || isPersisting}
          aria-label={exportLabel}
        >
          {exportLabel}
        </Button>
      </Group>
    </div>
  );
};

export default Toolbar;
