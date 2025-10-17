import type { Page } from "@playwright/test";
import { packerSpritePaddingLocator } from "../locators/packer-settings-form";

export const changePackerSpritePadding = async (
  page: Page,
  padding: number,
) => {
  const label = packerSpritePaddingLocator(page);
  await label.fill(String(padding));
  await label.press("Enter");
};
