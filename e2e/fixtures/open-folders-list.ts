import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { foldersListLocator } from "../locators/folders-list";

export const openFoldersList = async (page: Page) => {
  const list = foldersListLocator(page);
  if (!(await list.isVisible())) {
    await page
      .getByRole("tablist")
      .getByText(t("folders_list_sect_name"))
      .click();
    await list.waitFor({ state: "visible", timeout: 1000 });
  }
  return list;
};
