import type { Page } from "@playwright/test";
import {
  DEFAULT_CUSTOM_BIN_ID,
  type tPackerMultipackMode,
} from "../../src/config";

export const packedSpritesListLocator = (page: Page) => {
  return page.getByTestId("tree-viewport").getByRole("tree");
};

export const spritesInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="item"]');
};
export const spritesInDefaultCustomBinLocator = (page: Page) => {
  return spritesInSpecificBinLocator(page, { binId: DEFAULT_CUSTOM_BIN_ID });
};
export const spritesInSpecificBinLocator = (
  page: Page,
  { binId }: { binId: string },
) => {
  const list = packedSpritesListLocator(page);
  return list.locator(`[data-kind="item"][data-parent-bin="${binId}"]`);
};
export const oversizedSpritesInPackedListLocator = (
  page: Page,
  { multipack }: { multipack?: tPackerMultipackMode } = {},
) => {
  const list = packedSpritesListLocator(page);
  if (multipack === "manual") {
    return list.locator('[data-kind="item"][data-oversized="true"]');
  }
  return list.locator('[data-parent-bin="oversized"]');
};
export const binsInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="bin"]');
};
export const foldersInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="folder"]');
};
export const foldersInSpecificBinLocator = (
  page: Page,
  { binId }: { binId: string },
) => {
  const list = packedSpritesListLocator(page);
  return list.locator(`[data-kind="folder"][data-parent-bin="${binId}"]`);
};
export const foldersInDefaultCustomBinLocator = (page: Page) => {
  return foldersInSpecificBinLocator(page, { binId: DEFAULT_CUSTOM_BIN_ID });
};
export const oversizedFoldersInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="folder"][data-oversized="true"]');
};
export const oversizedCustomBinsInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="customBin"][data-oversized="true"]');
};
export const defaultCustomBinInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator(`[data-node-id="${DEFAULT_CUSTOM_BIN_ID}"]`);
};
export const customBinsInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-kind="customBin"]');
};
export const oversizedBinInPackedListLocator = (page: Page) => {
  const list = packedSpritesListLocator(page);
  return list.locator('[data-node-id="oversized"]');
};
