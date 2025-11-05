import type { Page } from "@playwright/test";
import {
  createFolderBtnLocator,
  folderEditorFormLocator,
  folderEditorIsAnimationLocator,
  folderEditorNameLocator,
} from "../locators/folders";
import { openFoldersListCtxMenu } from "./open-ctx-menu";
import { t } from "../utils/t";
import { generateImage } from "../utils/generate-image";

export const openFolderCreator = async (page: Page) => {
  await createFolderBtnLocator(page).click();
};
export const openFolderEditor = async (
  page: Page,
  { name }: { name: string },
) => {
  const ctxMenu = await openFoldersListCtxMenu(page, { nodeName: name });
  await ctxMenu.getByText(t("update")).click();
};
export const changeFolderName = async (page: Page, name: string) => {
  const field = folderEditorNameLocator(page);
  await field.fill(name);
};
export const changeFolderAnimationState = async (
  page: Page,
  value: boolean,
) => {
  const field = folderEditorIsAnimationLocator(page);
  if (value) {
    await field.check();
  } else {
    await field.uncheck();
  }
};
export const submitFolderForm = async (page: Page) => {
  const button = folderEditorFormLocator(page).locator('button[type="submit"]');
  await button.click();
};
export const waitUntilFolderFormIsSubmitted = async (page: Page) => {
  await folderEditorFormLocator(page).waitFor({ state: "detached" });
};

export const removeFolder = async (page: Page, { name }: { name: string }) => {
  const ctxMenu = await openFoldersListCtxMenu(page, { nodeName: name });
  await ctxMenu.getByText(t("remove")).click();
};
export const uploadSpritesToFolder = async (
  page: Page,
  { folderName, sprites }: { folderName: string; sprites: string[] },
) => {
  const ctxMenu = await openFoldersListCtxMenu(page, { nodeName: folderName });
  const filePaths = await Promise.all(sprites.map(generateImage));
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    ctxMenu.getByText(t("add_sprites")).click(),
  ]);
  await fileChooser.setFiles(filePaths);
};
