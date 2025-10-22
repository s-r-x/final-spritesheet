import type { Page } from "@playwright/test";
import {
  packerAllowRotLocator,
  packerEdgeSpacingLocator,
  packerPotLocator,
  packerSheetSizeLocator,
  packerSpritePaddingLocator,
} from "../locators/packer-settings";

export const changePackerAllowRot = async (page: Page, allowRot: boolean) => {
  const el = packerAllowRotLocator(page);
  if (allowRot) {
    await el.check();
  } else {
    await el.uncheck();
  }
};
export const togglePackerAllowRot = async (page: Page) => {
  const el = packerAllowRotLocator(page);
  await el.click();
};

export const changePackerEdgeSpacing = async (
  page: Page,
  edgeSpacing: number | string,
) => {
  const label = packerEdgeSpacingLocator(page);
  await label.fill(String(edgeSpacing));
  await label.press("Enter");
};

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

export const changePackerSheetSize = async (
  page: Page,
  size: number | string,
) => {
  const label = packerSheetSizeLocator(page);
  await label.selectOption(String(size));
};

export const changePackerSpritePadding = async (
  page: Page,
  padding: number | string,
) => {
  const label = packerSpritePaddingLocator(page);
  await label.fill(String(padding));
  await label.press("Enter");
};
