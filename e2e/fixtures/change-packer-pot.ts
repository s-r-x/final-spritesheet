import type { Page } from "@playwright/test";
import { packerPotLocator } from "../locators/packer-settings-form";

export const changePackerPot = async (page: Page, pot: boolean) => {
  const el = packerPotLocator(page);
  if (pot) {
    await el.check();
  } else {
    await el.uncheck();
  }
};

export const togglePackerPot = async (page: Page) => {
  const el = packerPotLocator(page);
  await el.click();
};
