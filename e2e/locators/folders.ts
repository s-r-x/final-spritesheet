import type { Page } from "@playwright/test";
import { t } from "../utils/t";

const formI18Ns = "folder_editor.";
export const createFolderBtnLocator = (page: Page) => {
  return page.getByText(t("folders.add_folder"));
};
export const folderEditorFormLocator = (page: Page) => {
  return page.getByRole("dialog").locator("form");
};
export const folderEditorNameLocator = (page: Page) => {
  return folderEditorFormLocator(page).getByLabel(t(formI18Ns + "name"));
};
export const folderEditorIsAnimationLocator = (page: Page) => {
  return folderEditorFormLocator(page).getByLabel(
    t(formI18Ns + "is_animation"),
  );
};
