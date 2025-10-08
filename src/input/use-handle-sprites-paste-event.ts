import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import { useEffect } from "react";
import { useAddSpritesFromFilesMutation } from "./use-add-sprites-from-files";

export const useHandleSpritesPasteEvent = () => {
  const addSpritesMut = useAddSpritesFromFilesMutation();
  useEffect(() => {
    const handler = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData?.files?.length) {
        return;
      }
      const filesToAdd = Array.from(clipboardData.files).filter((f) =>
        SUPPORTED_SPRITE_MIME_TYPES.includes(f.type),
      );
      addSpritesMut.mutate({ files: filesToAdd });
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [addSpritesMut.mutate]);
};
