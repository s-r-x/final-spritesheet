import type { Page } from "@playwright/test";
import { appMenuButtonLocator } from "../locators/app-menu";

export const openAppMenu = async (page: Page) => {
  await appMenuButtonLocator(page).click();
  const loc = page.locator(".mantine-Menu-dropdown");
  await loc.waitFor({ state: "visible" });
  return loc;
};
