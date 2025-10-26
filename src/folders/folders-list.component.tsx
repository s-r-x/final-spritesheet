import styles from "./folders-list.module.css";
import { Button, ActionIcon } from "@mantine/core";
import { Plus as PlusIcon } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";
import { useOpenFolderEditor } from "./use-folder-editor";
import FoldersTree from "@/sprite-trees/folders-tree.component";

const FoldersList = () => {
  const { t } = useTranslation();
  const openFolderEditor = useOpenFolderEditor();
  const addFolderBtnLabel = t("folders.add_folder");
  const openNewFolderCreator = () => openFolderEditor("new");
  return (
    <div className={styles.root}>
      <div className={styles.stickyHead}>
        <Button
          arial-label={addFolderBtnLabel}
          className={styles.wideViewportButton}
          fullWidth
          leftSection={<PlusIcon />}
          onClick={openNewFolderCreator}
        >
          {addFolderBtnLabel}
        </Button>
        <ActionIcon
          arial-label={addFolderBtnLabel}
          className={styles.narrowViewportButton}
          onClick={openNewFolderCreator}
        >
          <PlusIcon />
        </ActionIcon>
      </div>
      <FoldersTree />
    </div>
  );
};

export default FoldersList;
