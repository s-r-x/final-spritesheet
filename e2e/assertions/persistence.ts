import { expect, type Page } from "@playwright/test";
import { persistenceButtonLocator } from "../locators/persistence";

export const assertCanPersistChanges = async (page: Page) => {
  await expect(persistenceButtonLocator(page)).toBeEnabled();
};
export const assertCannotPersistChanges = async (page: Page) => {
  await expect(persistenceButtonLocator(page)).toHaveAttribute(
    "data-persisted",
    "true",
  );
};
