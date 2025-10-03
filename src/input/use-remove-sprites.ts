import { useStore } from "jotai";
import { spritesAtom } from "./sprites.atom";
import { useCallback } from "react";
import type { tSprite } from "./types";
import { RemoveSpritesCommand } from "./remove-sprites.command";
import { useHistoryManager } from "@/history/use-history-manager";

export const useRemoveSprites = () => {
  const atomsStore = useStore();
  const historyManager = useHistoryManager();
  return useCallback(
    async (id: string | string[]) => {
      const spritesToRemove = atomsStore
        .get(spritesAtom)
        .reduce((acc, sprite) => {
          const matched = Array.isArray(id)
            ? id.includes(sprite.id)
            : sprite.id === id;
          if (matched) {
            acc.push(sprite);
          }

          return acc;
        }, [] as tSprite[]);
      const command = new RemoveSpritesCommand({ sprites: spritesToRemove });
      historyManager.execCommand(command);
    },
    [historyManager],
  );
};
