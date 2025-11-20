import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { appBarLocator } from "./app-bar";

const formI18Ns = "project_editor.";

export const activeProjectNameLocator = (page: Page) => {
  return appBarLocator(page).getByTestId("active-project-name");
};
export const projectEditorFormLocator = (page: Page) => {
  return page.getByRole("dialog").locator("form");
};

export const projectEditorNameLocator = (page: Page) => {
  return projectEditorFormLocator(page).getByLabel(t(formI18Ns + "name"));
};
