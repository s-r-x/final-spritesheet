import type { Page } from "@playwright/test";
import { openPackedSpritesList } from "../fixtures/open-packed-sprites-list";
import {
  changeCustomBinName,
  openCustomBinEditor,
  submitCustomBinForm,
  waitUntilCustomBinFormIsSubmitted,
} from "../fixtures/custom-bins";
import { getActiveListTab } from "../queries/get-active-list-tab";
import { changeActiveListTab } from "../fixtures/change-active-list-tab";

export const updateCustomBinWorkflow = async (
  page: Page,
  {
    binName,
    updates,
  }: {
    binName: string;
    updates: {
      name?: string;
    };
  },
) => {
  const activeTab = await getActiveListTab(page);
  const shouldChangeTab = activeTab !== "packed";
  if (shouldChangeTab) {
    await openPackedSpritesList(page);
  }
  await openCustomBinEditor(page, { name: binName });
  if (updates.name) {
    await changeCustomBinName(page, updates.name);
  }
  await submitCustomBinForm(page);
  await waitUntilCustomBinFormIsSubmitted(page);
  if (shouldChangeTab) {
    await changeActiveListTab(page, activeTab);
  }
};
