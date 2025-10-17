import type { Page } from "@playwright/test";
import { undoButtonLocator } from "../locators/undo-button";

export const undo = async (page: Page) => {
  await undoButtonLocator(page).click();
};
