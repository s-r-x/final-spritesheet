import type { Page } from "@playwright/test";
import { ctxMenuLocator } from "../locators/ctx-menu";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";
import { foldersListLocator } from "../locators/folders-list";

export const openPackedSpritesListCtxMenu = async (
  page: Page,
  { nodeName }: { nodeName: string },
) => {
  const element = packedSpritesListLocator(page).getByText(nodeName, {
    exact: true,
  });
  await element.click({ button: "right" });
  return ctxMenuLocator(page);
};

export const openFoldersListCtxMenu = async (
  page: Page,
  { nodeName }: { nodeName: string },
) => {
  const element = foldersListLocator(page).getByText(nodeName, {
    exact: true,
  });
  await element.click({ button: "right" });
  return ctxMenuLocator(page);
};
export const closeCtxMenu = async (page: Page) => {
  await ctxMenuLocator(page).press("Escape");
};
