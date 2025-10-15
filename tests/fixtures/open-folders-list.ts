import { expect, type Page } from "@playwright/test";
import { t } from "../utils/t";
import { getFoldersList } from "./locators";

export const openFoldersList = async (page: Page) => {
  await page
    .getByRole("tablist")
    .getByText(t("folders_list_sect_name"))
    .click();
  const tree = getFoldersList(page);
  await expect(tree, "ensure the folders list is visible").toBeVisible({
    timeout: 1000,
  });
  return tree;
};
