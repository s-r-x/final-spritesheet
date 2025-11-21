import type { tSprite, tUpdateSpriteData } from "./types";
import { UpdateSpriteCommand } from "./update-sprite.command";
import { useHistoryManager } from "@/history/use-history-manager";

export const useUpdateSprite = () => {
  const historyManager = useHistoryManager();
  return async (sprite: tSprite, updates: tUpdateSpriteData) => {
    const command = new UpdateSpriteCommand({
      originalSprite: sprite,
      updates,
    });
    await historyManager.execCommand(command);
  };
};
