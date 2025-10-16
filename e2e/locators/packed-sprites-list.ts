import type { Page } from "@playwright/test";

export const packedSpritesListLocator = (page: Page) => {
  return page.getByTestId("packed-sprites-tree-viewport").getByRole("tree");
};
