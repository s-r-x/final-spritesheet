import type { Page } from "@playwright/test";
import { customBinsInPackedListLocator } from "../locators/packed-sprites-list";

export const getCustomBinId = (page: Page, name: string) => {
  const id = customBinsInPackedListLocator(page)
    .filter({ hasText: name })
    .getAttribute("data-node-id");
  return id;
};
