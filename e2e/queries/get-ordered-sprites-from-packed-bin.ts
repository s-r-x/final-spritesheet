import type { Page } from "@playwright/test";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";

export const getOrderedSpritesFromPackedBin = async (
  page: Page,
  name?: string,
): Promise<string[]> => {
  const list = packedSpritesListLocator(page);
  const locator = list.getByRole("treeitem", {
    level: 2,
    ...(name ? { name, exact: true } : {}),
  });
  await locator.first().waitFor({ state: "visible" });
  return locator.allTextContents();
};
