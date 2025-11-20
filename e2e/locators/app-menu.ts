import type { Page } from "@playwright/test";
import { appBarLocator } from "./app-bar";

export const appMenuButtonLocator = (page: Page) => {
  return appBarLocator(page).getByRole("button");
};
