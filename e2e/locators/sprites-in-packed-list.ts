import type { Page } from "@playwright/test";
import { packedSpritesListLocator } from "./packed-sprites-list";

export const spritesInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="item"]');
};
