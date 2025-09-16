import { useSetAtom } from "jotai";
import { updateSpriteAtom } from "./sprites.atom";
import { useCallback } from "react";
import type { tUpdateSpriteData } from "./types";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useUpdateSprite = () => {
  const updateSprite = useSetAtom(updateSpriteAtom);
  const eventBus = useEventBus();
  return useCallback((id: string, updates: tUpdateSpriteData) => {
    updateSprite(id, updates);
    eventBus.emit("spriteUpdated", { id, updates });
  }, []);
};
