import type { Page } from "@playwright/test";
import { activeListTabsLocator } from "../locators/active-list-tabs-locator";
import { t } from "../utils/t";

export const changeActiveListTab = async (
  page: Page,
  tab: "packed" | "folders",
) => {
  await activeListTabsLocator(page)
    .getByRole("tab")
    .filter({
      hasText:
        tab === "folders"
          ? t("folders_list_sect_name")
          : t("packed_sprites_list_sect_name"),
    })
    .click();
};
