import { expect, type Page } from "@playwright/test";
import { activeProjectNameLocator } from "../locators/projects";
import { t } from "../utils/t";

export const assertActiveProjectName = async (page: Page, name: string) => {
  await expect(activeProjectNameLocator(page)).toHaveText(name);
};
export const assertProjectNotFound = async (page: Page) => {
  await expect(
    page.getByText(t("project_not_found_screen.message")),
  ).toBeVisible();
};
