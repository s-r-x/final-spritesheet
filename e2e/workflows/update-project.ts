import type { Page } from "@playwright/test";
import {
  changeProjectName,
  openProjectEditor,
  submitProjectForm,
  waitUntilProjectFormIsSubmitted,
} from "../fixtures/projects";

export const updateProjectWorkflow = async (
  page: Page,
  {
    data,
  }: {
    data: {
      name: string;
    };
  },
) => {
  await openProjectEditor(page);
  if (data.name) {
    await changeProjectName(page, data.name);
  }
  await submitProjectForm(page);
  await waitUntilProjectFormIsSubmitted(page);
};
