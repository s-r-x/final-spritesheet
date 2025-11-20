import { expect, test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { createProjectWorkflow } from "./workflows/create-project";
import {
  assertActiveProjectName,
  assertProjectNotFound,
} from "./assertions/projects";
import { openProjectsList, removeProject } from "./fixtures/projects";
import { updateProjectWorkflow } from "./workflows/update-project";

test.beforeEach(async ({ page }) => {
  await navigateTo(page);
});

test("should create a new project", async ({ page }) => {
  const name = "my new project";
  await createProjectWorkflow(page, { data: { name } });
  await assertActiveProjectName(page, name);
  const projectsLoc = await openProjectsList(page);
  await expect(projectsLoc).toHaveCount(2);
  await expect(projectsLoc.filter({ hasText: name })).toBeVisible();
});
test("should update projects", async ({ page }) => {
  const name = "updated project";
  await updateProjectWorkflow(page, { data: { name } });
  await assertActiveProjectName(page, name);
  const projectsLoc = await openProjectsList(page);
  await expect(projectsLoc).toHaveCount(1);
  await expect(projectsLoc.filter({ hasText: name })).toBeVisible();
});
test("should remove projects", async ({ page }) => {
  await removeProject(page);
  await assertProjectNotFound(page);
});
