import type { tSprite } from "@/input/types";

export const packerSpriteExcerptFields = [
  "id",
  "width",
  "height",
] as const satisfies (keyof tSprite)[];
