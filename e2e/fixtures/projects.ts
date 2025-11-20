import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { openAppMenu } from "./open-app-menu";
import {
  projectEditorFormLocator,
  projectEditorNameLocator,
} from "../locators/projects";

export const openProjectCreator = async (page: Page) => {
  const appMenuLoc = await openAppMenu(page);
  await appMenuLoc.getByText(t("app_menu.new_project")).click();
};
export const openProjectEditor = async (page: Page) => {
  const appMenuLoc = await openAppMenu(page);
  await appMenuLoc.getByText(t("app_menu.edit_project")).click();
};
export const removeProject = async (page: Page) => {
  const appMenuLoc = await openAppMenu(page);
  await appMenuLoc.getByText(t("app_menu.remove_project")).click();
  const confirmBtnLoc = page
    .getByRole("dialog")
    .getByText(t("confirm_dialog.default_yes"), { exact: true });
  await confirmBtnLoc.click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
};
export const changeProjectName = async (page: Page, name: string) => {
  const field = projectEditorNameLocator(page);
  await field.fill(name);
};
export const submitProjectForm = async (page: Page) => {
  const button = projectEditorFormLocator(page).locator(
    'button[type="submit"]',
  );
  await button.click();
};
export const waitUntilProjectFormIsSubmitted = async (page: Page) => {
  await projectEditorFormLocator(page).waitFor({ state: "detached" });
};

export const openProjectsList = async (page: Page) => {
  const appMenuLoc = await openAppMenu(page);
  await appMenuLoc.getByText(t("app_menu.show_projects_list")).click();
  const listLoc = appMenuLoc.getByTestId("projects-list");
  await listLoc.waitFor({ state: "visible" });
  return listLoc.locator("a");
};
export const closeProjectsList = async (page: Page) => {
  await page.locator(".mantine-Menu-dropdown").press("Escape");
};
