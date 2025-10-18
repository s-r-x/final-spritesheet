import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";

export const openPackedSpritesList = async (page: Page) => {
  const list = packedSpritesListLocator(page);
  if (!(await list.isVisible())) {
    await page
      .getByRole("tablist")
      .getByText(t("packed_sprites_list_sect_name"))
      .click();
    await list.waitFor({ state: "visible", timeout: 1000 });
  }
  return list;
};
