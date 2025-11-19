import { Tabs, type MantineColor } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import {
  Package as PackedSpritesIcon,
  PackageX as PackedSpritesFailIcon,
  PackageCheck as PackedSpritesOkIcon,
  Folder as FoldersIcon,
} from "lucide-react";
import { usePersistedState } from "#hooks/use-persisted-state";
import FoldersList from "@/folders/folders-list.component";
import PackedSpritesList from "@/packer/packed-sprites-list.component";
import { usePackerStatus } from "@/packer/use-packed-sprites";
import SharedErrorBoundary from "./-shared-error-boundary";
import styles from "./-packed-sprites-and-folders.module.css";

const PackedSpritesAndFolders = () => {
  const { t } = useTranslation();

  const iconSize = 20;
  const packedSpritesLabel = t("packed_sprites_list_sect_name");
  const foldersLabel = t("folders_list_sect_name");
  const [value, setValue] = usePersistedState({
    key: "sprites_and_folders_tab",
    defaultValue: "bins",
  });
  const packerStatus = usePackerStatus();
  const renderPackedIcon = () => {
    let IconComponent: typeof PackedSpritesIcon;
    switch (packerStatus) {
      case "failed":
      case "partially_packed":
        IconComponent = PackedSpritesFailIcon;
        break;
      case "packed":
        IconComponent = PackedSpritesOkIcon;
        break;
      case "idle":
        IconComponent = PackedSpritesIcon;
        break;
      default:
        IconComponent = PackedSpritesIcon;
    }
    return <IconComponent size={iconSize} />;
  };
  let packedColor: MantineColor | undefined;
  switch (packerStatus) {
    case "failed":
    case "partially_packed":
      packedColor = "red";
      break;
    default:
      packedColor = undefined;
  }
  return (
    <Tabs
      keepMounted={false}
      value={value}
      variant="pills"
      onChange={(value) => {
        if (value) setValue(value);
      }}
      classNames={{
        root: styles.tabsRoot,
        tab: styles.tabButton,
        tabSection: styles.tabSection,
        tabLabel: styles.tabLabel,
        list: styles.tabsList,
      }}
    >
      <Tabs.List>
        <Tabs.Tab
          aria-label={packedSpritesLabel}
          leftSection={renderPackedIcon()}
          color={packedColor}
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
      <Tabs.Panel value="folders" className={styles.tabPanel}>
        <SharedErrorBoundary>
          <FoldersList />
        </SharedErrorBoundary>
      </Tabs.Panel>
      <Tabs.Panel value="bins" className={styles.tabPanel}>
        <SharedErrorBoundary>
          <PackedSpritesList />
        </SharedErrorBoundary>
      </Tabs.Panel>
    </Tabs>
  );
};

export default PackedSpritesAndFolders;
