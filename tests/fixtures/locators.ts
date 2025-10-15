import type { Page } from "@playwright/test";

export const getPackedSpritesList = (page: Page) => {
  return page.getByTestId("packed-sprites-tree-viewport").getByRole("tree");
};
export const getFoldersList = (page: Page) => {
  return page.getByTestId("folders-tree-viewport").getByRole("tree");
};
