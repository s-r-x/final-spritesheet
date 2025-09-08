import { useAtomValue } from "jotai";
import { hasAnySpritesAtom } from "./sprites.atom";
import styles from "./sprites-list.module.css";
import { useFocusSprite } from "@/canvas/use-focus-sprite";
import { type JSX, memo } from "react";
import { useContextMenu } from "mantine-contextmenu";
import { Avatar, Text, Group, Stack, Badge, Menu } from "@mantine/core";
import type { tSprite } from "./types";
import { useOpenSpriteEditor } from "./use-sprite-editor";
import { FileButton, Button, ActionIcon } from "@mantine/core";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useTranslation } from "@/i18n/use-translation";
import { useAddSpritesFromFiles } from "./use-add-sprites-from-files";
import { useRemoveSprites } from "./use-remove-sprites";
import { usePackedSprites } from "@/packer/use-packed-sprites";
import { isEmpty } from "#utils/is-empty";
import {
  PackageCheck as PackageCheckIcon,
  PackageX as PackageFailIcon,
  Ellipsis as EllipsisIcon,
} from "lucide-react";
import { useFocusBin } from "@/canvas/use-focus-bin";

const SpritesList = () => {
  const { t } = useTranslation();
  const openSpriteEditor = useOpenSpriteEditor();
  const { bins, oversizedSprites } = usePackedSprites();
  const addSpritesFromFiles = useAddSpritesFromFiles();
  const removeSprite = useRemoveSprites();
  const focusSprite = useFocusSprite();
  const focusBin = useFocusBin();
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
  }: {
    index: number;
    title: string;
    color?: string;
    sprites: tSprite[];
    icon: JSX.Element;
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
              <Menu.Item onClick={() => focusBin(index)}>
                {t("focus")}
              </Menu.Item>
              <Menu.Item
                onClick={() => removeSprite(sprites.map((sprite) => sprite.id))}
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
              sprite={sprite}
              openEditor={openSpriteEditor}
              focusSprite={focusSprite}
              removeSprite={removeSprite}
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
  sprite: tSprite;
  openEditor: (id: string) => void;
  focusSprite: (id: string) => void;
  removeSprite: (id: string) => void;
};
const SpriteItem = memo(
  ({ sprite, openEditor, focusSprite, removeSprite }: tProps) => {
    const { t } = useTranslation();
    const { showContextMenu } = useContextMenu();
    return (
      <li
        tabIndex={0}
        className={styles.listItem}
        onDoubleClick={() => focusSprite(sprite.id)}
        onContextMenu={showContextMenu([
          {
            key: "focus",
            title: t("focus"),
            onClick: () => focusSprite(sprite.id),
          },
          {
            key: "remove",
            title: t("remove"),
            onClick: () => removeSprite(sprite.id),
          },
          {
            key: "rename",
            title: t("rename"),
            onClick: () => openEditor(sprite.id),
          },
        ])}
      >
        <Avatar src={sprite.url} radius="sm" size="sm" />
        <span>{sprite.name}</span>
      </li>
    );
  },
);

export default SpritesList;
