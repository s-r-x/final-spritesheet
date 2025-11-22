import styles from "./styles.module.css";
import { type CSSProperties, forwardRef } from "react";
import { Avatar, ActionIcon } from "@mantine/core";
import type { tSprite } from "@/input/types";
import { Badge } from "@mantine/core";
import {
  PackageCheck as PackageCheckIcon,
  PackageX as PackageFailIcon,
  Folder as FolderIcon,
  Film as AnimationIcon,
  Package as PackageNeutralIcon,
  GripVertical as DragIcon,
  Ellipsis as OpenActionsIcon,
} from "lucide-react";
import type { tFolder } from "@/folders/types";
import { useIsTouchDevice } from "#hooks/use-is-touch-device";
import { useTranslation } from "@/i18n/use-translation";

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
        <OpenActionsButton />
      </div>
    );
  },
);

type tItemProps = {
  item: tSprite;
  style?: CSSProperties;
  disableDrag?: boolean;
};
export const ItemNode = forwardRef<any, tItemProps>((props, ref) => {
  const shouldRenderDragButton = !props.disableDrag;
  return (
    <div
      style={props.style}
      ref={shouldRenderDragButton ? undefined : ref}
      className={styles.item}
    >
      {shouldRenderDragButton && <DragButton ref={ref} />}
      <Avatar
        imageProps={{ draggable: false }}
        src={props.item.url}
        radius="sm"
        size="sm"
      />
      <span className={styles.nodeTitle}>{props.item.name}</span>
      <OpenActionsButton />
    </div>
  );
});

type tFolderProps = {
  folder: tFolder;
  name: string;
  isOversized?: boolean;
  style?: CSSProperties;
  disableDrag?: boolean;
};
export const FolderNode = forwardRef<any, tFolderProps>((props, ref) => {
  const iconSize = 20;
  const shouldRenderDragButton = !props.disableDrag;
  return (
    <div
      style={props.style}
      ref={shouldRenderDragButton ? undefined : ref}
      className={styles.folder}
    >
      {shouldRenderDragButton && <DragButton ref={ref} />}
      {props.folder.isAnimation ? (
        <AnimationIcon size={iconSize} className={styles.folderIcon} />
      ) : (
        <FolderIcon size={iconSize} className={styles.folderIcon} />
      )}
      <span className={styles.nodeTitle}>{props.name}</span>
      <OpenActionsButton />
    </div>
  );
});

const DragButton = forwardRef<any>((_props, ref) => {
  const isTouchDevice = useIsTouchDevice();
  if (!isTouchDevice) return null;
  return (
    <ActionIcon
      aria-hidden
      color="currentColor"
      variant="transparent"
      ref={ref}
    >
      <DragIcon />
    </ActionIcon>
  );
});
const OpenActionsButton = () => {
  const isTouchDevice = useIsTouchDevice();
  const { t } = useTranslation();
  if (!isTouchDevice) return null;
  return (
    <ActionIcon
      aria-label={t("open_menu")}
      color="currentColor"
      variant="transparent"
      onClick={(e) => {
        const event = new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: e.clientX,
          clientY: e.clientY,
        });
        e.target.dispatchEvent(event);
      }}
    >
      <OpenActionsIcon />
    </ActionIcon>
  );
};

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
