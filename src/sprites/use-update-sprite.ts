import { useSetAtom } from "jotai";
import { updateSpriteAtom } from "./sprites.atom";
import { useCallback } from "react";
import type { tSprite } from "./types";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useUpdateSprite = () => {
  const updateSprite = useSetAtom(updateSpriteAtom);
  const eventBus = useEventBus();
  return useCallback((id: string, updates: Partial<Pick<tSprite, "name">>) => {
    updateSprite(id, updates);
    eventBus.emit("spriteUpdated", { id, updates });
  }, []);
};
