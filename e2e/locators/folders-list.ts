import type { Page } from "@playwright/test";
import { SPRITES_ROOT_FOLDER_ID } from "../../src/config";

export const foldersListLocator = (page: Page) => {
  return page.getByTestId("tree-viewport").getByRole("tree");
};
export const spritesInFoldersListLocator = (page: Page) => {
  return foldersListLocator(page).locator('[data-kind="item"]');
};
export const spritesInSpecificFolderLocator = (
  page: Page,
  { folderId }: { folderId: string },
) => {
  const list = foldersListLocator(page);
  return list.locator(`[data-kind="item"][data-parent-folder="${folderId}"]`);
};
export const spritesInRootFolderLocator = (page: Page) => {
  return spritesInSpecificFolderLocator(page, {
    folderId: SPRITES_ROOT_FOLDER_ID,
  });
};
export const foldersInFoldersListLocator = (page: Page) => {
  const list = foldersListLocator(page);
  return list.locator('[data-kind="folder"]');
};
export const rootFolderLocator = (page: Page) => {
  const list = foldersListLocator(page);
  return list.locator(`[data-node-id="${SPRITES_ROOT_FOLDER_ID}"]`);
};
export const specificFolderLocator = (
  page: Page,
  { folderId }: { folderId: string },
) => {
  const list = foldersListLocator(page);
  return list.locator(`[data-kind="folder"][data-node-id="${folderId}"]`);
};
