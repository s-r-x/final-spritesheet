import type { Page } from "@playwright/test";
import { foldersInFoldersListLocator } from "../locators/folders-list";
import { invariant } from "../../src/common/utils/invariant";

export const getFolderId = async (page: Page, name: string) => {
  const id = await foldersInFoldersListLocator(page)
    .filter({ hasText: name })
    .getAttribute("data-node-id");
  invariant(id);
  return id;
};
