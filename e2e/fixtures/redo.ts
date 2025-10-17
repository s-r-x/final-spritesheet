import type { Page } from "@playwright/test";
import { redoButtonLocator } from "../locators/redo-button";

export const redo = async (page: Page) => {
  await redoButtonLocator(page).click();
};
