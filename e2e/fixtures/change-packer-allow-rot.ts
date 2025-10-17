import type { Page } from "@playwright/test";
import { packerRotationLocator } from "../locators/packer-settings-form";

export const changePackerAllowRot = async (page: Page, allowRot: boolean) => {
  const el = packerRotationLocator(page);
  if (allowRot) {
    await el.check();
  } else {
    await el.uncheck();
  }
};
export const togglePackerAllowRot = async (page: Page) => {
  const el = packerRotationLocator(page);
  await el.click();
};
