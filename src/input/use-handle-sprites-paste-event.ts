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
      const filesToAdd = Array.from(clipboardData.files);
      addSpritesMut.mutate({ files: filesToAdd });
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [addSpritesMut.mutate]);
};
