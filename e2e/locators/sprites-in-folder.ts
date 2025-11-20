import type { Page, Locator } from "@playwright/test";
import { getFolderId } from "../queries/get-folder-id";
import { SPRITES_ROOT_FOLDER_ID } from "../../src/config";
import { foldersListLocator } from "./folders-list";

export function spritesInFolderLocator(
  page: Page,
  args: { folderId: string },
): Locator;
export function spritesInFolderLocator(
  page: Page,
  args: { folderName: string },
): Promise<Locator>;

export function spritesInFolderLocator(
  page: Page,
  { folderId, folderName }: { folderId?: string; folderName?: string },
): Locator | Promise<Locator> {
  if (!folderId && !folderName) {
    throw new Error("folderId or folderName should be specified");
  }
  const list = foldersListLocator(page);
  const createLocator = (folderId: string) => {
    return list.locator(`[data-parent-folder="${folderId}"]`);
  };
  if (folderId) {
    return createLocator(folderId);
  } else {
    return getFolderId(page, folderName!).then((id) => {
      return createLocator(id);
    });
  }
}

export function spritesInRootFolderLocator(page: Page) {
  return spritesInFolderLocator(page, { folderId: SPRITES_ROOT_FOLDER_ID });
}
