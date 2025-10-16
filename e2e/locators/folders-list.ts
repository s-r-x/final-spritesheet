import type { Page } from "@playwright/test";

export const foldersListLocator = (page: Page) => {
  return page.getByTestId("folders-tree-viewport").getByRole("tree");
};
