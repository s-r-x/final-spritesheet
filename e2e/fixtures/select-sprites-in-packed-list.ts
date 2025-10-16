import type { Locator, Page } from "@playwright/test";
import { packedSpritesListLocator } from "../locators/packed-sprites-list";
import { foldersListLocator } from "../locators/folders-list";

type tSelectionRange = [start: string, end?: string];
const selectItemsInList = async ({
  listLocator: list,
  selection,
}: {
  listLocator: Locator;
  selection: tSelectionRange;
}) => {
  const [startText, endText] = selection;
  await list.getByRole("treeitem", { name: startText, exact: true }).click();
  if (endText) {
    await list
      .getByRole("treeitem", { name: endText, exact: true })
      .click({ modifiers: ["Shift"] });
  }
};
export const selectItemsInPackedList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const list = packedSpritesListLocator(page);
  return selectItemsInList({
    selection,
    listLocator: list,
  });
};

export const selectItemsInFoldersList = async (
  page: Page,
  { selection }: { selection: tSelectionRange },
) => {
  const list = foldersListLocator(page);
  return selectItemsInList({
    selection,
    listLocator: list,
  });
};
