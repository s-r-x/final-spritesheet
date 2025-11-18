import type { Page } from "@playwright/test";
import {
  packerAlgorithmLocator,
  packerAllowRotLocator,
  packerEdgeSpacingLocator,
  packerMultipackModeLocator,
  packerPotLocator,
  packerSquareLocator,
  packerSheetSizeLocator,
  packerSpritePaddingLocator,
} from "../locators/packer-settings";
import type { tPackerAlgorithm, tPackerMultipackMode } from "../../src/config";

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

export const changePackerSquare = async (page: Page, square: boolean) => {
  const el = packerSquareLocator(page);
  if (square) {
    await el.check();
  } else {
    await el.uncheck();
  }
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

export const changePackerMultipackMode = async (
  page: Page,
  mode: tPackerMultipackMode,
) => {
  const label = packerMultipackModeLocator(page);
  await label.selectOption(mode);
};
export const changePackerAlgorithm = async (
  page: Page,
  algorithm: tPackerAlgorithm,
) => {
  const label = packerAlgorithmLocator(page);
  await label.selectOption(algorithm);
};
