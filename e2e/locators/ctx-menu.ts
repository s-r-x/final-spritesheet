import type { Page } from "@playwright/test";

export const ctxMenuLocator = (page: Page) => {
  return page.getByTestId("context-menu");
};
