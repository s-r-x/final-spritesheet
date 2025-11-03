import type { Page } from "@playwright/test";

export const activeListTabsLocator = (page: Page) => {
  return page.getByRole("tablist");
};
