import { useEffect, useRef, useState } from "react";
import styles from "./canvas-dropzone.module.css";
import { Dropzone } from "@mantine/dropzone";
import { Group, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { hasAnySpritesAtom } from "@/input/sprites.atom";
import {
  Image as IconPhoto,
  Upload as IconUpload,
  X as IconX,
} from "lucide-react";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useTranslation } from "@/i18n/use-translation";
import { useAddSpritesFromFilesMutation } from "@/input/use-add-sprites-from-files";

const CanvasDropzone = () => {
  const { t } = useTranslation();
  const isDragging = useIsDragging();
  const hasAnySprites = useAtomValue(hasAnySpritesAtom);
  const isInteractive = isDragging || !hasAnySprites;
  const addSpritesMut = useAddSpritesFromFilesMutation();

  return (
    <Dropzone
      accept={SUPPORTED_SPRITE_MIME_TYPES}
      onDrop={(files) => {
        addSpritesMut.mutate({ files });
      }}
      style={{
        pointerEvents: isInteractive ? "auto" : "none",
      }}
      className={styles.root}
    >
      {!hasAnySprites && (
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--app-color-blue-light)" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--app-color-danger)" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--app-color-dimmed)" />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {t("sprites_drop_zone.head")}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {t("sprites_drop_zone.desc", {
                supportedFormats: SUPPORTED_SPRITE_MIME_TYPES.join(", "),
              })}
            </Text>
          </div>
        </Group>
      )}
    </Dropzone>
  );
};

const useIsDragging = () => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef<number>(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent): void => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent): void => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent): void => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent): void => {
      e.preventDefault();
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);
  return isDragging;
};

export default CanvasDropzone;
