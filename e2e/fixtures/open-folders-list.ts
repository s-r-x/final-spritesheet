import type { Page } from "@playwright/test";
import { foldersListLocator } from "../locators/folders-list";
import { getActiveListTab } from "../queries/get-active-list-tab";
import { changeActiveListTab } from "./change-active-list-tab";

export const openFoldersList = async (page: Page) => {
  const activeTab = await getActiveListTab(page);
  if (activeTab !== "folders") {
    await changeActiveListTab(page, "folders");
  }
  const list = foldersListLocator(page);
  await list.waitFor({ state: "visible", timeout: 1000 });
  return list;
};
