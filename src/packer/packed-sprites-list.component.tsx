import { useAtomValue } from "jotai";
import { hasAnySpritesAtom } from "@/input/sprites.atom";
import styles from "./packed-sprites-list.module.css";
import { useFocusSprite } from "@/canvas/use-focus-sprite";
import { type JSX, memo, useCallback } from "react";
import { useContextMenu } from "mantine-contextmenu";
import { Avatar, Text, Group, Stack, Badge, Menu } from "@mantine/core";
import type { tSprite } from "@/input/types";
import { useOpenSpriteEditor } from "@/input/use-sprite-editor";
import { FileButton, Button, ActionIcon } from "@mantine/core";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useTranslation } from "@/i18n/use-translation";
import { useAddSpritesFromFiles } from "@/input/use-add-sprites-from-files";
import { useRemoveSprites } from "@/input/use-remove-sprites";
import { usePackedSprites } from "./use-packed-sprites";
import { isEmpty } from "#utils/is-empty";
import {
  PackageCheck as PackageCheckIcon,
  PackageX as PackageFailIcon,
  Ellipsis as EllipsisIcon,
} from "lucide-react";
import { useFocusBin } from "@/canvas/use-focus-bin";
import { isDefined } from "#utils/is-defined";
import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useCloseLeftPanelModal } from "@/layout/use-left-panel-modal";
import { useMutation } from "@/common/hooks/use-mutation";

const PackedSpritesList = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobileLayout();
  const closeLeftPanel = useCloseLeftPanelModal();
  const openSpriteEditor = useOpenSpriteEditor();
  const { bins, oversizedSprites } = usePackedSprites();
  const addSpritesFromFiles = useAddSpritesFromFiles();
  const removeSprite = useRemoveSprites();
  const removeSpriteMut = useMutation(removeSprite);
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
  const hasAnySprites = useAtomValue(hasAnySpritesAtom);
  const errorColor = "var(--mantine-color-error)";
  if (!hasAnySprites) {
    return (
      <div>
        <FileButton
          onChange={(files) => {
            addSpritesFromFiles(files);
          }}
          accept={SUPPORTED_SPRITE_MIME_TYPES.join(",")}
          multiple
        >
          {(props) => (
            <Button {...props} color="cyan">
              {t("add_sprites")}
            </Button>
          )}
        </FileButton>
      </div>
    );
  }
  const renderBin = ({
    color,
    title,
    sprites,
    icon,
    index,
    disableFocus,
  }: {
    index: number;
    title: string;
    color?: string;
    sprites: tSprite[];
    icon: JSX.Element;
    disableFocus?: boolean;
  }) => {
    return (
      <Stack gap="xs" key={index}>
        <Group gap="xs" style={{ color }}>
          {icon}
          <Text fw={700} span>
            {title}
          </Text>
          <Badge color="gray" size="sm" circle={sprites.length < 10}>
            {sprites.length}
          </Badge>
          <Menu width={200}>
            <Menu.Target>
              <ActionIcon
                aria-label={t("open_menu")}
                ml="auto"
                size="sm"
                variant="transparent"
              >
                <EllipsisIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {!disableFocus && (
                <Menu.Item onClick={() => focusBin(index)}>
                  {t("focus")}
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() =>
                  removeSpriteMut.mutate(sprites.map((sprite) => sprite.id))
                }
              >
                {t("remove")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <ul className={styles.list}>
          {sprites.map((sprite) => (
            <SpriteItem
              key={sprite.id}
              name={sprite.name}
              id={sprite.id}
              imageUrl={sprite.url}
              openEditor={openSpriteEditor}
              focusSprite={disableFocus ? undefined : focusSprite}
              removeSprite={removeSpriteMut.mutate}
            />
          ))}
        </ul>
      </Stack>
    );
  };
  return (
    <Stack gap="lg">
      {!isEmpty(oversizedSprites) &&
        renderBin({
          index: -1,
          color: errorColor,
          icon: <PackageFailIcon />,
          title: t("oversized_sprites"),
          sprites: oversizedSprites,
          disableFocus: true,
        })}
      {bins.map((bin, index) =>
        renderBin({
          index,
          title: `Bin ${index + 1}`,
          icon: <PackageCheckIcon />,
          sprites: bin.sprites,
        }),
      )}
    </Stack>
  );
};

type tProps = {
  id: string;
  name: string;
  imageUrl: string;
  openEditor: (id: string) => void;
  focusSprite?: (id: string) => void;
  removeSprite: (id: string) => void;
};
const SpriteItem = memo(
  ({ id, name, imageUrl, openEditor, focusSprite, removeSprite }: tProps) => {
    const { t } = useTranslation();
    const { showContextMenu } = useContextMenu();
    return (
      <li
        tabIndex={0}
        className={styles.listItem}
        onDoubleClick={() => focusSprite?.(id)}
        onContextMenu={showContextMenu(
          [
            {
              key: "update",
              title: t("update"),
              onClick: () => openEditor(id),
            },
            focusSprite && {
              key: "focus",
              title: t("focus"),
              onClick: () => focusSprite(id),
            },
            {
              key: "remove",
              title: t("remove"),
              onClick: () => removeSprite(id),
            },
          ].filter(isDefined),
        )}
      >
        <Avatar src={imageUrl} radius="sm" size="sm" />
        <span>{name}</span>
      </li>
    );
  },
);

export default memo(PackedSpritesList);
