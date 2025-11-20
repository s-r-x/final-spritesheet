import type { Page } from "@playwright/test";
import { foldersInPackedListLocator } from "../locators/packed-sprites-list";
import { foldersInFoldersListLocator } from "../locators/folders-list";

type tSelectionRange = [startName: string, endName?: string];
export const selectFoldersInPackedList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const [startText, endText] = selection;
  const loc = foldersInPackedListLocator(page);
  await loc.filter({ hasText: startText }).click();
  if (endText) {
    await loc.filter({ hasText: endText }).click({
      modifiers: ["Shift"],
    });
  }
};

export const selectFoldersInFoldersList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const [startText, endText] = selection;
  const loc = foldersInFoldersListLocator(page);
  await loc.filter({ hasText: startText }).click();
  if (endText) {
    await loc.filter({ hasText: endText }).click({
      modifiers: ["Shift"],
    });
  }
};
