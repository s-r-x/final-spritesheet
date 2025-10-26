import styles from "./packed-sprites-list.module.css";
import { memo } from "react";
import { ActionIcon } from "@mantine/core";
import { FileButton, Button } from "@mantine/core";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useTranslation } from "@/i18n/use-translation";
import { useAddSpritesFromFilesMutation } from "@/input/use-add-sprites-from-files";
import {
  PackagePlus as AddNewBinIcon,
  ImagePlus as AddNewSpriteIcon,
} from "lucide-react";
import { useOpenCustomBinEditor } from "#custom-bins/use-custom-bin-editor";
import { usePackerMultipackMode } from "./use-packer-settings";
import PackedTree from "@/sprite-trees/packed-tree.component";
import ManuallyPackedTree from "@/sprite-trees/manually-packed-tree.component";

const PackedSpritesList = () => {
  const { t } = useTranslation();
  const addSpritesFromFilesMut = useAddSpritesFromFilesMutation();
  const openCustomBinEditor = useOpenCustomBinEditor();
  const createNewCustomBin = () => openCustomBinEditor("new");
  const multipackMode = usePackerMultipackMode();
  const addSpritesBtnLabel = t("add_sprites");
  const addCustomBinLabel = t("add_custom_bin");
  const stickyButtonIconSize = 20;
  const renderTree = () => {
    if (multipackMode === "manual") {
      return <ManuallyPackedTree />;
    } else {
      return <PackedTree />;
    }
  };
  return (
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
                leftSection={<AddNewSpriteIcon size={stickyButtonIconSize} />}
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
                <AddNewSpriteIcon size={stickyButtonIconSize} />
              </ActionIcon>
            </>
          )}
        </FileButton>
        {multipackMode === "manual" && (
          <>
            <Button
              className={styles.wideViewportButton}
              aria-label={addCustomBinLabel}
              leftSection={<AddNewBinIcon size={stickyButtonIconSize} />}
              fullWidth
              onClick={createNewCustomBin}
            >
              {addCustomBinLabel}
            </Button>
            <ActionIcon
              className={styles.narrowViewportButton}
              aria-label={addCustomBinLabel}
              onClick={createNewCustomBin}
            >
              <AddNewBinIcon size={stickyButtonIconSize} />
            </ActionIcon>
          </>
        )}
      </div>
      {renderTree()}
    </div>
  );
};

export default memo(PackedSpritesList);
