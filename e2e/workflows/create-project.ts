import type { Page } from "@playwright/test";
import {
  changeProjectName,
  openProjectCreator,
  submitProjectForm,
  waitUntilProjectFormIsSubmitted,
} from "../fixtures/projects";

export const createProjectWorkflow = async (
  page: Page,
  {
    data,
  }: {
    data: {
      name: string;
    };
  },
) => {
  await openProjectCreator(page);
  if (data.name) {
    await changeProjectName(page, data.name);
  }
  await submitProjectForm(page);
  await waitUntilProjectFormIsSubmitted(page);
};
