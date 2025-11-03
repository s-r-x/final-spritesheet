import type { Page } from "@playwright/test";
import {
  spritesInFoldersListLocator,
  spritesInSpecificFolderLocator,
} from "../locators/folders-list";

export const getOrderedSpritesFromFolder = async (
  page: Page,
  { folderId, expectEmpty }: { folderId?: string; expectEmpty?: boolean } = {},
): Promise<string[]> => {
  const locator = folderId
    ? spritesInSpecificFolderLocator(page, { folderId })
    : spritesInFoldersListLocator(page);
  if (!expectEmpty) {
    await locator.first().waitFor({ state: "visible" });
  }
  return locator.allTextContents();
};
