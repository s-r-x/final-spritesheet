import type { Page } from "@playwright/test";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";
import { getActiveListTab } from "../queries/get-active-list-tab";
import { changeActiveListTab } from "./change-active-list-tab";

export const openPackedSpritesList = async (page: Page) => {
  const activeTab = await getActiveListTab(page);
  if (activeTab !== "folders") {
    await changeActiveListTab(page, "packed");
  }
  const list = packedSpritesListLocator(page);
  await list.waitFor({ state: "visible", timeout: 1000 });
};
