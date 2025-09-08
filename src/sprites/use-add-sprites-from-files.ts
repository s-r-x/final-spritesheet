import { useSetAtom } from "jotai";
import { addSpritesAtom } from "./sprites.atom";
import { useCallback } from "react";
import { useEventBus } from "@/event-bus/use-event-bus";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { tSprite } from "./types";
import { fileToSprite } from "./sprites.mapper";

export const useAddSpritesFromFiles = () => {
  const addSprites = useSetAtom(addSpritesAtom);
  const projectId = useActiveProjectId();
  const eventBus = useEventBus();
  return useCallback(
    async (files: File[]) => {
      if (!projectId) {
        throw new Error("no project id");
      }
      const sprites: tSprite[] = await Promise.all(
        files.map((file) => fileToSprite({ file, projectId })),
      );
      addSprites(sprites);
      eventBus.emit("spritesAdded", { sprites });
    },
    [projectId],
  );
};
