import { useSetAtom } from "jotai";
import { removeSpritesAtom } from "./sprites.atom";
import { useCallback } from "react";
import { isEmpty } from "#utils/is-empty";
import { useEventBus } from "@/event-bus/use-event-bus";

export const useRemoveSprites = () => {
  const removeSprites = useSetAtom(removeSpritesAtom);
  const eventBus = useEventBus();
  return useCallback((ids: string | string[]) => {
    const removedSprites = removeSprites(ids);
    if (!isEmpty(removedSprites)) {
      eventBus.emit("spritesRemoved", {
        ids: removedSprites.map(({ id }) => id),
      });
    }
  }, []);
};
