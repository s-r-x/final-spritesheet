import type { Page } from "@playwright/test";
import {
  createCustomBinBtnLocator,
  customBinEditorFormLocator,
  customBinEditorNameLocator,
} from "../locators/custom-bins";
import { openPackedSpritesListCtxMenu } from "./open-ctx-menu";
import { t } from "../utils/t";

export const openCustomBinCreator = async (page: Page) => {
  await createCustomBinBtnLocator(page).click();
};
export const openCustomBinEditor = async (
  page: Page,
  { name }: { name: string },
) => {
  const ctxMenu = await openPackedSpritesListCtxMenu(page, { nodeName: name });
  await ctxMenu.getByText(t("update")).click();
};

export const changeCustomBinName = async (page: Page, name: string) => {
  const field = customBinEditorNameLocator(page);
  await field.fill(name);
};
export const submitCustomBinForm = async (page: Page) => {
  const button = customBinEditorFormLocator(page).locator(
    'button[type="submit"]',
  );
  await button.click();
};

export const waitUntilCustomBinFormIsSubmitted = async (page: Page) => {
  await customBinEditorFormLocator(page).waitFor({ state: "detached" });
};

export const removeCustomBin = async (page: Page, name: string) => {
  const ctxMenu = await openPackedSpritesListCtxMenu(page, { nodeName: name });
  await ctxMenu.getByText(t("remove")).click();
};
