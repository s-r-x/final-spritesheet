import { expect, type Page } from "@playwright/test";
import {
  packerPotLocator,
  packerAllowRotLocator,
  packerSheetSizeLocator,
  packerEdgeSpacingLocator,
  packerSpritePaddingLocator,
} from "../locators/packer-settings";
import { assertCheckboxValue } from "./helpers";

export const assertPackerAllowRotValue = async (page: Page, value: boolean) => {
  await assertCheckboxValue(packerAllowRotLocator(page), value);
};

export const assertPackerPotValue = async (page: Page, value: boolean) => {
  await assertCheckboxValue(packerPotLocator(page), value);
};

export const assertPackerSheetSizeValue = async (page: Page, value: string) => {
  await expect(packerSheetSizeLocator(page)).toHaveValue(value);
};

export const assertPackerEdgeSpacingValue = async (
  page: Page,
  value: string,
) => {
  await expect(packerEdgeSpacingLocator(page)).toHaveValue(value);
};

export const assertPackerSpritePaddingValue = async (
  page: Page,
  value: string,
) => {
  await expect(packerSpritePaddingLocator(page)).toHaveValue(value);
};
