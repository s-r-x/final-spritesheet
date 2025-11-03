import type { Page } from "@playwright/test";
import { foldersInFoldersListLocator } from "../locators/folders-list";

export const getFolderId = (page: Page, name: string) => {
  const id = foldersInFoldersListLocator(page)
    .filter({ hasText: name })
    .getAttribute("data-node-id");
  return id;
};
