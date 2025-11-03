import type { Page } from "@playwright/test";
import { openPackedSpritesList } from "../fixtures/open-packed-sprites-list";
import {
  changeCustomBinName,
  openCustomBinCreator,
  submitCustomBinForm,
  waitUntilCustomBinFormIsSubmitted,
} from "../fixtures/custom-bins";
import { getActiveListTab } from "../queries/get-active-list-tab";
import { changeActiveListTab } from "../fixtures/change-active-list-tab";

export const createCustomBinWorkflow = async (
  page: Page,
  {
    data,
  }: {
    data: {
      name?: string;
    };
  },
) => {
  const activeTab = await getActiveListTab(page);
  const shouldChangeTab = activeTab !== "packed";
  if (shouldChangeTab) {
    await openPackedSpritesList(page);
  }
  await openCustomBinCreator(page);
  if (data.name) {
    await changeCustomBinName(page, data.name);
  }
  await submitCustomBinForm(page);
  await waitUntilCustomBinFormIsSubmitted(page);
  if (shouldChangeTab) {
    await changeActiveListTab(page, activeTab);
  }
};
