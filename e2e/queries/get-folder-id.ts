import type { Page } from "@playwright/test";
import { foldersListLocator } from "../locators/folders-list";

export const getFolderIdByName = async (
  page: Page,
  name: string,
): Promise<string | null> => {
  const list = foldersListLocator(page);
  const folderId = await list
    .getByRole("treeitem", { level: 1 })
    .filter({ hasText: name })
    .getAttribute("data-node-id");
  return folderId;
};
