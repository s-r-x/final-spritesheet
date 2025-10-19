import { expect, type Page } from "@playwright/test";
import { undoButtonLocator } from "../locators/undo-button";
import { redoButtonLocator } from "../locators/redo-button";

export const assertCanUndo = async (page: Page) => {
  await expect(undoButtonLocator(page)).toBeEnabled();
};
export const assertCannotUndo = async (page: Page) => {
  await expect(undoButtonLocator(page)).toBeDisabled();
};
export const assertCanRedo = async (page: Page) => {
  await expect(redoButtonLocator(page)).toBeEnabled();
};
export const assertCannotRedo = async (page: Page) => {
  await expect(redoButtonLocator(page)).toBeDisabled();
};
