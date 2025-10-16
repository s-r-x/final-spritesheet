import type { Locator, Page } from "@playwright/test";
import { ctxMenuLocator } from "../locators/ctx-menu";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";
import { foldersListLocator } from "../locators/folders-list";

const openListCtxMenu = async (
  page: Page,
  {
    itemName,
    parentName,
    listLocator,
  }: { itemName?: string; parentName?: string; listLocator: Locator },
) => {
  if (!itemName && !parentName) {
    throw new Error("item name or parent name should be specified");
  }
  const element = listLocator.getByRole("treeitem", {
    level: itemName ? 2 : 1,
    name: itemName || parentName,
    exact: true,
  });
  await element.click({ button: "right" });
  return ctxMenuLocator(page);
};
export const openPackedSpritesListCtxMenu = async (
  page: Page,
  { spriteName, binName }: { spriteName?: string; binName?: string },
) => {
  return openListCtxMenu(page, {
    listLocator: packedSpritesListLocator(page),
    itemName: spriteName,
    parentName: binName,
  });
};

export const openFoldersListCtxMenu = async (
  page: Page,
  { spriteName, folderName }: { spriteName?: string; folderName?: string },
) => {
  if (!spriteName && !folderName) {
    throw new Error("spriteName or folderName should be specified");
  }
  return openListCtxMenu(page, {
    listLocator: foldersListLocator(page),
    itemName: spriteName,
    parentName: folderName,
  });
};
