import type { Page } from "@playwright/test";
import { activeListTabsLocator } from "../locators/active-list-tabs-locator";
import { invariant } from "../../src/common/utils/invariant";
import { t } from "../utils/t";

export const getActiveListTab = async (
  page: Page,
): Promise<"packed" | "folders"> => {
  const tabs = activeListTabsLocator(page);
  await tabs.waitFor({ state: "attached" });
  const text = await activeListTabsLocator(page)
    .getByRole("tab", {
      selected: true,
    })
    .textContent();
  invariant(text, "no tab");
  return text === t("folders_list_sect_name") ? "folders" : "packed";
};
