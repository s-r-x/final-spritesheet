import FoldersList from "@/folders/folders-list.component";
import { useTranslation } from "@/i18n/use-translation";
import PackedSpritesList from "@/packer/packed-sprites-list.component";
import { Tabs } from "@mantine/core";
import {
  Package as PackedSpritesIcon,
  Folder as FoldersIcon,
} from "lucide-react";
import styles from "./packed-sprites-and-folders.module.css";
import { useLocalStorage } from "@mantine/hooks";

const PackedSpritesAndFolders = () => {
  const { t } = useTranslation();

  const iconSize = 20;
  const packedSpritesLabel = t("packed_sprites_list_sect_name");
  const foldersLabel = t("folders_list_sect_name");
  const [value, setValue] = useLocalStorage({
    key: "sprites_and_folders_tab",
    defaultValue: "bins",
  });
  return (
    <Tabs
      keepMounted={false}
      value={value}
      variant="pills"
      onChange={(value) => {
        if (value) setValue(value);
      }}
      className={styles.root}
    >
      <Tabs.List>
        <Tabs.Tab
          aria-label={packedSpritesLabel}
          leftSection={<PackedSpritesIcon size={iconSize} />}
          value="bins"
        >
          {packedSpritesLabel}
        </Tabs.Tab>
        <Tabs.Tab
          aria-label={foldersLabel}
          leftSection={<FoldersIcon size={iconSize} />}
          value="folders"
        >
          {foldersLabel}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="folders" className={styles.panel}>
        <FoldersList />
      </Tabs.Panel>
      <Tabs.Panel value="bins" className={styles.panel}>
        <PackedSpritesList />
      </Tabs.Panel>
    </Tabs>
  );
};

export default PackedSpritesAndFolders;
