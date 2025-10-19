import type { Page } from "@playwright/test";
import { persistenceButtonLocator } from "../locators/persistence";

export const persistChanges = async (page: Page) => {
  const button = persistenceButtonLocator(page);
  await button.click();
};
