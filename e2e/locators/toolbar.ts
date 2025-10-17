import { Page } from "@playwright/test";

export const toolbarLocator = (page: Page) => {
  return page.getByRole("toolbar");
};
