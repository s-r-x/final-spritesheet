import styles from "./styles.module.css";
import { type CSSProperties, forwardRef } from "react";
import { Avatar } from "@mantine/core";
import type { tSprite } from "@/input/types";
import { Badge } from "@mantine/core";
import {
  PackageCheck as PackageCheckIcon,
  PackageX as PackageFailIcon,
  Folder as FolderIcon,
  Film as AnimationIcon,
  Package as PackageNeutralIcon,
} from "lucide-react";
import type { tFolder } from "@/folders/types";

type tBinProps = {
  name: string;
  isOversized?: boolean;
  itemsCount: number;
  oversizedCount?: number;
  style?: CSSProperties;
};
export const BinNode = forwardRef<any, tBinProps>(
  ({ name, style, isOversized, itemsCount, oversizedCount = 0 }, ref) => {
    const iconSize = 20;
    const hasOversized = oversizedCount > 0;
    let IconComponent: typeof PackageNeutralIcon;
    if (!itemsCount && !oversizedCount) {
      IconComponent = PackageNeutralIcon;
    } else if (isOversized) {
      IconComponent = PackageFailIcon;
    } else {
      IconComponent = PackageCheckIcon;
    }
    return (
      <div style={style} ref={ref} className={styles.bin}>
        <IconComponent size={iconSize} className={styles.binIcon} />
        <span className={styles.nodeTitle}>{name}</span>
        {itemsCount > 0 && (
          <Badge
            className={styles.itemsCount}
            color={"green"}
            size="sm"
            circle={itemsCount < 10}
          >
            {itemsCount}
          </Badge>
        )}
        {hasOversized && (
          <Badge
            className={styles.itemsCount}
            color="red"
            size="sm"
            circle={oversizedCount < 10}
          >
            {oversizedCount}
          </Badge>
        )}
      </div>
    );
  },
);

type tItemProps = {
  item: tSprite;
  style?: CSSProperties;
};
export const ItemNode = forwardRef<any, tItemProps>((props, ref) => {
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

type tFolderProps = {
  folder: tFolder;
  name: string;
  isOversized?: boolean;
  style?: CSSProperties;
};
export const FolderNode = forwardRef<any, tFolderProps>(
  ({ folder, style, name }, ref) => {
    const iconSize = 20;
    return (
      <div style={style} ref={ref} className={styles.folder}>
        {folder.isAnimation ? (
          <AnimationIcon size={iconSize} className={styles.folderIcon} />
        ) : (
          <FolderIcon size={iconSize} className={styles.folderIcon} />
        )}
        <span className={styles.nodeTitle}>{name}</span>
      </div>
    );
  },
);

export const DefaultNode = forwardRef<
  any,
  { name: string; style?: CSSProperties }
>(({ name, style }, ref) => {
  return (
    <div style={style} ref={ref}>
      🍁{name}
    </div>
  );
});
