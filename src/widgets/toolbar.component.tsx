import styles from "./toolbar.module.css";
import { FileButton, Button, Group, ActionIcon } from "@mantine/core";
import {
  Plus as PlusIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  List as ListIcon,
} from "lucide-react";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useAddSpritesFromFiles } from "@/sprites/use-add-sprites-from-files";
import { useExportSpritesheet } from "@/output/use-export-spritesheet";
import { useTranslation } from "@/i18n/use-translation";
import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useRightPanelModal } from "@/layout/use-right-panel-modal";
import { useLeftPanelModal } from "@/layout/use-left-panel-modal";

const Toolbar = () => {
  const { t } = useTranslation();
  const addSprites = useAddSpritesFromFiles();
  const exportSpritesheet = useExportSpritesheet();
  const isMobile = useIsMobileLayout();
  const openLeftPanel = useLeftPanelModal();
  const openRightPanel = useRightPanelModal();
  const addSpritesLabel = t("add_sprites");
  const exportLabel = t("export");
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
              >
                {addSpritesLabel}
              </Button>
            )
          }
        </FileButton>
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
        <Button
          variant="light"
          leftSection={<DownloadIcon size={20} />}
          size="sm"
          onClick={exportSpritesheet}
          aria-label={exportLabel}
        >
          {exportLabel}
        </Button>
      </Group>
    </div>
  );
};

export default Toolbar;
