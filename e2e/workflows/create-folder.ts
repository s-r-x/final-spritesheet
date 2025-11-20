import type { Page } from "@playwright/test";
import { getActiveListTab } from "../queries/get-active-list-tab";
import { changeActiveListTab } from "../fixtures/change-active-list-tab";
import { openFoldersList } from "../fixtures/open-folders-list";
import {
  changeFolderAnimationState,
  changeFolderName,
  openFolderCreator,
  submitFolderForm,
  waitUntilFolderFormIsSubmitted,
} from "../fixtures/folders";

export const createFolderWorkflow = async (
  page: Page,
  {
    data,
  }: {
    data: {
      name: string;
      isAnimation?: boolean;
    };
  },
) => {
  const activeTab = await getActiveListTab(page);
  const shouldChangeTab = activeTab !== "folders";
  if (shouldChangeTab) {
    await openFoldersList(page);
  }
  await openFolderCreator(page);
  if (data.name) {
    await changeFolderName(page, data.name);
  }
  if (typeof data.isAnimation === "boolean") {
    await changeFolderAnimationState(page, data.isAnimation);
  }
  await submitFolderForm(page);
  await waitUntilFolderFormIsSubmitted(page);
  if (shouldChangeTab) {
    await changeActiveListTab(page, activeTab);
  }
};
