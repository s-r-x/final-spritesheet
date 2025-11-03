import type { Page } from "@playwright/test";
import { spritesInPackedListLocator } from "../locators/packed-sprites-list";

export const getOrderedSpritesFromPackedBin = async (
  page: Page,
  name?: string,
): Promise<string[]> => {
  let locator = spritesInPackedListLocator(page);
  if (name) {
    locator = locator.filter({ hasText: name });
  }
  await locator.first().waitFor({ state: "visible" });
  return locator.allTextContents();
};
