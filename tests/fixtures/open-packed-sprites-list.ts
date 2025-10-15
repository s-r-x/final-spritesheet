import { expect, type Page } from "@playwright/test";
import { t } from "../utils/t";
import { getPackedSpritesList } from "./locators";

export const openPackedSpritesList = async (page: Page) => {
  await page
    .getByRole("tablist")
    .getByText(t("packed_sprites_list_sect_name"))
    .click();
  const tree = getPackedSpritesList(page);
  await expect(tree, "ensure the packed sprites list is visible").toBeVisible({
    timeout: 1000,
  });
  return tree;
};
