import type { Page } from "@playwright/test";
import { packerSheetSizeLocator } from "../locators/packer-settings-form";

export const changePackerSheetSize = async (page: Page, size: number) => {
  const label = packerSheetSizeLocator(page);
  await label.click();
  await page.getByRole("option", { name: String(size) }).click();
};
