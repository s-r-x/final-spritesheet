import type { Page } from "@playwright/test";
import { spritesInPackedListLocator } from "../locators/packed-sprites-list";
import { spritesInFoldersListLocator } from "../locators/folders-list";

type tSelectionRange = [startName: string, endName?: string];
export const selectItemsInPackedList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const [startText, endText] = selection;
  const loc = spritesInPackedListLocator(page);
  await loc.filter({ hasText: startText }).click();
  if (endText) {
    await loc.filter({ hasText: endText }).click({
      modifiers: ["Shift"],
    });
  }
};

export const selectItemsInFoldersList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const [startText, endText] = selection;
  const loc = spritesInFoldersListLocator(page);
  await loc.filter({ hasText: startText }).click();
  if (endText) {
    await loc.filter({ hasText: endText }).click({
      modifiers: ["Shift"],
    });
  }
};
