import test, { expect } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { openFoldersList } from "./fixtures/open-folders-list";
import { createFolderWorkflow } from "./workflows/create-folder";
import {
  foldersInFoldersListLocator,
  rootFolderLocator,
  specificFolderLocator,
  spritesInFoldersListLocator,
  spritesInRootFolderLocator,
  spritesInSpecificFolderLocator,
} from "./locators/folders-list";
import { removeFolder, uploadSpritesToFolder } from "./fixtures/folders";
import { updateFolderWorkflow } from "./workflows/update-folder";
import { openFoldersListCtxMenu } from "./fixtures/open-ctx-menu";
import { t } from "./utils/t";
import { getFolderId } from "./queries/get-folder-id";
import { invariant } from "../src/common/utils/invariant";
import { getOrderedSpritesFromFolder } from "./queries/get-ordered-sprites-from-folder";
import { selectItemsInFoldersList } from "./fixtures/select-sprites";
import { SPRITES_ROOT_FOLDER_ID } from "../src/config";
import { last } from "radash";
import { dragAndDrop } from "./fixtures/drag-and-drop";
import { undo } from "./fixtures/undo";
import { redo } from "./fixtures/redo";

test.beforeEach(async ({ page }) => {
  await navigateTo(page);
  await openFoldersList(page);
});

test("should create, update and remove folders", async ({ page }) => {
  await createFolderWorkflow(page, { data: { name: "1" } });
  await createFolderWorkflow(page, { data: { name: "2" } });
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);

  await updateFolderWorkflow(page, {
    folderName: "1",
    data: { name: "42", isAnimation: true },
  });
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "1" }),
  ).not.toBeVisible();

  const updatedFolderLoc = foldersInFoldersListLocator(page).filter({
    hasText: "42",
  });
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);
  await expect(updatedFolderLoc).toBeVisible();
  await expect(updatedFolderLoc).toHaveAttribute("data-animation", "true");

  await removeFolder(page, { name: "2" });
  await expect(foldersInFoldersListLocator(page)).toHaveCount(2);

  {
    const ctxMenu = await openFoldersListCtxMenu(page, {
      nodeName: t("folders.default_folder_name"),
    });
    await ctxMenu.waitFor({ state: "visible" });
    await expect(
      ctxMenu.getByText(t("remove")),
      "should't be able to remove the default folder",
    ).not.toBeVisible();
    await expect(
      ctxMenu.getByText(t("update")),
      "shouldn't be able to update the default folder",
    ).not.toBeVisible();
  }

  await undo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);

  await undo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);
  await expect(updatedFolderLoc).not.toBeVisible();
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "1" }),
  ).toHaveAttribute("data-animation", "false");

  await undo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(2);
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "2" }),
  ).not.toBeVisible();

  await undo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(1);

  await redo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(2);
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "1" }),
  ).toBeVisible();

  await redo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "2" }),
  ).toBeVisible();

  await redo(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(3);
  await expect(
    foldersInFoldersListLocator(page).filter({ hasText: "42" }),
  ).toHaveAttribute("data-animation", "true");
});
test("should upload sprites to specific folder", async ({ page }) => {
  const sprites = ["256x256.webp", "256x256-red.webp"];
  await uploadSpritesToFolder(page, {
    folderName: t("folders.default_folder_name"),
    sprites,
  });
  await expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);

  await createFolderWorkflow(page, { data: { name: "new" } });
  const sprites2 = ["256x256-yellow.webp"];
  await uploadSpritesToFolder(page, { folderName: "new", sprites: sprites2 });
  const folderId = await getFolderId(page, "new");
  invariant(folderId);
  await expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    sprites2.length,
  );
  await expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);

  await undo(page);
  await expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    0,
  );
  await expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);

  await undo(page);
  await undo(page);
  await expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    0,
  );
  await expect(spritesInRootFolderLocator(page)).toHaveCount(0);

  await redo(page);
  await expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    0,
  );
  await expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);

  await redo(page);
  await redo(page);
  await expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    sprites2.length,
  );
  await expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);
});

test("should move sprites between folders", async ({ page }) => {
  const sprites = ["256x256.webp", "256x256-red.webp"];
  await uploadSpritesToFolder(page, {
    folderName: t("folders.default_folder_name"),
    sprites,
  });

  const sprites2 = [
    "256x256-yellow.webp",
    "256x256-blue.webp",
    "256x256-green.webp",
  ];
  await createFolderWorkflow(page, { data: { name: "one" } });
  await createFolderWorkflow(page, { data: { name: "two" } });
  await uploadSpritesToFolder(page, { folderName: "one", sprites: sprites2 });
  const folder2Id = await getFolderId(page, "one");
  const folder3Id = await getFolderId(page, "two");
  invariant(folder2Id);
  invariant(folder3Id);
  const ordered2: string[] = await getOrderedSpritesFromFolder(page, {
    folderId: folder2Id,
  });
  const ordered3: string[] = [];
  await selectItemsInFoldersList(page, { selection: [ordered2[0]] });
  const spritesIn2FolderLoc = spritesInSpecificFolderLocator(page, {
    folderId: folder2Id,
  });
  const spritesIn3FolderLoc = spritesInSpecificFolderLocator(page, {
    folderId: folder3Id,
  });
  await dragAndDrop({
    src: spritesIn2FolderLoc.filter({ hasText: sprites2[0] }),
    dst: rootFolderLocator(page),
  });
  expect(spritesIn2FolderLoc).toHaveCount(sprites2.length - 1);
  await expect(spritesInRootFolderLocator(page)).toHaveCount(
    sprites.length + 1,
  );
  ordered2.shift();

  const rootOrdered = await getOrderedSpritesFromFolder(page, {
    folderId: SPRITES_ROOT_FOLDER_ID,
  });
  await selectItemsInFoldersList(page, {
    selection: [rootOrdered[0], last(rootOrdered)!],
  });
  await dragAndDrop({
    src: spritesInRootFolderLocator(page).first(),
    dst: spritesInSpecificFolderLocator(page, { folderId: folder2Id }).filter({
      hasText: ordered2[0],
    }),
    position: "top",
  });
  await expect(spritesInRootFolderLocator(page)).toHaveCount(0);
  await expect(spritesIn2FolderLoc).toHaveCount(
    sprites.length + sprites2.length,
  );
  ordered2.splice(0, 0, ...rootOrdered);
  expect(
    await getOrderedSpritesFromFolder(page, { folderId: folder2Id }),
  ).toEqual(ordered2);

  await selectItemsInFoldersList(page, {
    selection: [ordered2[0], ordered2[1]],
  });
  await dragAndDrop({
    src: spritesIn2FolderLoc.filter({ hasText: ordered2[0] }),
    dst: specificFolderLocator(page, { folderId: folder3Id }),
  });
  ordered3.push(...ordered2.splice(0, 2));
  await expect(spritesInRootFolderLocator(page)).toHaveCount(0);
  await expect(spritesIn2FolderLoc).toHaveCount(
    sprites.length + sprites2.length - 2,
  );
  await expect(spritesIn3FolderLoc).toHaveCount(2);
  expect(
    await getOrderedSpritesFromFolder(page, { folderId: folder3Id }),
  ).toEqual(ordered3);

  await undo(page);
  ordered2.unshift(...ordered3.splice(0, 2));
  expect(spritesIn2FolderLoc).toHaveCount(sprites2.length + sprites.length);
  expect(spritesIn3FolderLoc).toHaveCount(0);
  await expect(spritesInRootFolderLocator(page)).toHaveCount(0);
  expect(
    await getOrderedSpritesFromFolder(page, { folderId: folder2Id }),
  ).toEqual(ordered2);

  await redo(page);
  ordered3.push(...ordered2.splice(0, 2));
  await expect(spritesInRootFolderLocator(page)).toHaveCount(0);
  await expect(spritesIn2FolderLoc).toHaveCount(
    sprites.length + sprites2.length - 2,
  );
  await expect(spritesIn3FolderLoc).toHaveCount(2);
});
test("should move sprites inside the same folder", async ({ page }) => {
  let initialSprites = [
    "256x256.webp",
    "256x256-red.webp",
    "256x256-green.webp",
  ];
  const folderName = "one";
  await createFolderWorkflow(page, { data: { name: folderName } });
  const folderId = await getFolderId(page, folderName);
  invariant(folderId);
  await uploadSpritesToFolder(page, {
    folderName: folderName,
    sprites: initialSprites,
  });
  let actualSprites: string[] = [];
  const refreshActualSprites = async (expectEmpty?: boolean) => {
    actualSprites = await getOrderedSpritesFromFolder(page, {
      folderId,
      expectEmpty,
    });
  };
  await refreshActualSprites();
  initialSprites = actualSprites;

  await selectItemsInFoldersList(page, { selection: [actualSprites[0]] });
  await dragAndDrop({
    src: spritesInFoldersListLocator(page).filter({
      hasText: actualSprites[0],
    }),
    dst: spritesInFoldersListLocator(page).filter({
      hasText: last(actualSprites)!,
    }),
    position: "bottom",
  });

  expect(spritesInSpecificFolderLocator(page, { folderId })).toHaveCount(
    initialSprites.length,
  );
  await refreshActualSprites();
  const expectedSprites1 = [
    "256x256-red.webp",
    "256x256-green.webp",
    "256x256.webp",
  ];
  expect(actualSprites).toEqual(expectedSprites1);

  await selectItemsInFoldersList(page, {
    selection: [actualSprites[0], actualSprites[1]],
  });
  await dragAndDrop({
    src: spritesInFoldersListLocator(page).filter({
      hasText: actualSprites[0],
    }),
    dst: spritesInFoldersListLocator(page).filter({
      hasText: last(actualSprites)!,
    }),
    position: "bottom",
  });
  await refreshActualSprites();
  const expectedSprites2 = [
    "256x256.webp",
    "256x256-red.webp",
    "256x256-green.webp",
  ];
  expect(actualSprites).toEqual(expectedSprites2);

  await selectItemsInFoldersList(page, {
    selection: [actualSprites[1]],
  });
  const dropTargetLoc = spritesInFoldersListLocator(page).filter({
    hasText: actualSprites[0],
  });

  await dragAndDrop({
    src: spritesInFoldersListLocator(page).filter({
      hasText: actualSprites[1],
    }),
    dst: dropTargetLoc,
    position: "top",
  });
  await refreshActualSprites();
  const expectedSprites3 = [
    "256x256-red.webp",
    "256x256.webp",
    "256x256-green.webp",
  ];
  expect(actualSprites).toEqual(expectedSprites3);

  await undo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(expectedSprites2);

  await undo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(expectedSprites1);

  await undo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(initialSprites);

  await undo(page);
  await refreshActualSprites(true);
  expect(actualSprites).toEqual([]);

  await redo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(initialSprites);

  await redo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(expectedSprites1);

  await redo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(expectedSprites2);

  await redo(page);
  await refreshActualSprites();
  expect(actualSprites).toEqual(expectedSprites3);
});
