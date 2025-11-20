import type { Page } from "@playwright/test";

export const appBarLocator = (page: Page) => {
  return page.getByTestId("app-bar");
};
