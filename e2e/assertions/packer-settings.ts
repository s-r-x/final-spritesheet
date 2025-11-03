import { expect, type Page } from "@playwright/test";
import {
  packerPotLocator,
  packerAllowRotLocator,
  packerSheetSizeLocator,
  packerEdgeSpacingLocator,
  packerSpritePaddingLocator,
  packerAlgorithmLocator,
  packerMultipackModeLocator,
} from "../locators/packer-settings";
import { assertCheckboxValue } from "./helpers";
import type { tPackerAlgorithm, tPackerMultipackMode } from "../../src/config";

export const assertPackerAllowRotValue = async (page: Page, value: boolean) => {
  await assertCheckboxValue(packerAllowRotLocator(page), value);
};

export const assertPackerPotValue = async (page: Page, value: boolean) => {
  await assertCheckboxValue(packerPotLocator(page), value);
};

export const assertPackerSheetSizeValue = async (
  page: Page,
  value: string | number,
) => {
  await expect(packerSheetSizeLocator(page)).toHaveValue(String(value));
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

export const assertPackerAlgorithmValue = async (
  page: Page,
  value: tPackerAlgorithm,
) => {
  await expect(packerAlgorithmLocator(page)).toHaveValue(value);
};
export const assertPackerMultipackValue = async (
  page: Page,
  value: tPackerMultipackMode,
) => {
  await expect(packerMultipackModeLocator(page)).toHaveValue(value);
};

export const assertAllowRotEnabledState = async (
  page: Page,
  state: boolean,
) => {
  if (state) {
    await expect(packerAllowRotLocator(page)).toBeEnabled();
  } else {
    await expect(packerAllowRotLocator(page)).toBeDisabled();

  }
};
