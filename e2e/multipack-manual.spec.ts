import { test, expect } from "@playwright/test";
import { uploadSprites } from "./fixtures/upload-sprites";
import {
  changePackerMultipackMode,
  changePackerSheetSize,
} from "./fixtures/change-packer-settings";
import { navigateTo } from "./fixtures/navigate-to";
import {
  customBinsInPackedListLocator,
  defaultCustomBinInPackedListLocator,
  foldersInDefaultCustomBinLocator,
  foldersInPackedListLocator,
  foldersInSpecificBinLocator,
  oversizedSpritesInPackedListLocator,
  spritesInDefaultCustomBinLocator,
  spritesInPackedListLocator,
  spritesInSpecificBinLocator,
} from "./locators/packed-sprites-list";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { removeCustomBin } from "./fixtures/custom-bins";
import { updateCustomBinWorkflow } from "./workflows/update-custom-bin";
import { createCustomBinWorkflow } from "./workflows/create-custom-bin";
import { createFolderWorkflow } from "./workflows/create-folder";
import { getCustomBinId } from "./queries/get-custom-bin-id";
import { getOrderedSpritesFromPackedBin } from "./queries/get-ordered-sprites-from-packed-bin";
import { selectItemsInPackedList } from "./fixtures/select-sprites";
import { dragAndDrop } from "./fixtures/drag-and-drop";
import { undo } from "./fixtures/undo";
import { redo } from "./fixtures/redo";

test.beforeEach(async ({ page }) => {
  await navigateTo(page);
  await openPackedSpritesList(page);
  await changePackerMultipackMode(page, "manual");
});
test("should render fitted and oversized sprites", async ({ page }) => {
  await changePackerSheetSize(page, 1024);
  const sprites = ["512x512.webp", "1024x1024.webp", "512x512-blue.webp"];
  await uploadSprites(page, {
    sprites,
  });
  await expect(spritesInPackedListLocator(page)).toHaveCount(sprites.length);
  await expect(customBinsInPackedListLocator(page)).toHaveCount(1);
  await expect(
    oversizedSpritesInPackedListLocator(page, { multipack: "manual" }),
  ).toHaveCount(2);
});
test("should create, update and delete custom bins", async ({ page }) => {
  const binName = "new bin";
  await createCustomBinWorkflow(page, { data: { name: binName } });
  await expect(customBinsInPackedListLocator(page)).toHaveCount(2);
  await expect(
    customBinsInPackedListLocator(page).filter({ hasText: binName }),
  ).toHaveCount(1);

  const newBinName = "updated bin";
  await updateCustomBinWorkflow(page, {
    binName,
    updates: {
      name: newBinName,
    },
  });
  await expect(
    customBinsInPackedListLocator(page).filter({ hasText: newBinName }),
  ).toHaveCount(1);

  await removeCustomBin(page, newBinName);
  await expect(customBinsInPackedListLocator(page)).toHaveCount(1);
});
test("should move items across custom bins", async ({ page }) => {
  const binName = "new bin";
  await createCustomBinWorkflow(page, { data: { name: binName } });
  const sprites = ["256x256.webp", "512x512.webp"];
  await uploadSprites(page, { sprites });
  const spritesLocator = spritesInPackedListLocator(page);
  const binLocator = customBinsInPackedListLocator(page).filter({
    hasText: binName,
  });
  const binId = await getCustomBinId(page, binName);
  const orderedSprites = (await getOrderedSpritesFromPackedBin(page)) as [
    string,
    string,
  ];
  await selectItemsInPackedList(page, { selection: orderedSprites });
  await dragAndDrop({
    src: spritesLocator.first(),
    dst: binLocator,
  });
  await expect(spritesInDefaultCustomBinLocator(page)).toHaveCount(0);
  await expect(spritesInSpecificBinLocator(page, { binId })).toHaveCount(2);

  {
    const orderedSprites = (await getOrderedSpritesFromPackedBin(page)) as [
      string,
      string,
    ];
    await selectItemsInPackedList(page, { selection: orderedSprites });
    await dragAndDrop({
      src: spritesLocator.first(),
      dst: defaultCustomBinInPackedListLocator(page),
    });
    await expect(spritesInDefaultCustomBinLocator(page)).toHaveCount(2);
    await expect(spritesInSpecificBinLocator(page, { binId })).toHaveCount(0);
  }
});
test("should move folders across custom bins", async ({ page }) => {
  const binName = "new bin";
  const folderName = "new folder";
  const foldersLocator = foldersInPackedListLocator(page);
  await createCustomBinWorkflow(page, { data: { name: binName } });
  await createFolderWorkflow(page, { data: { name: folderName } });

  await expect(foldersInDefaultCustomBinLocator(page)).toHaveCount(1);

  // if there's only one folder drag and drop to another bin doesn't work
  // for some reason in the playwright tests
  // so we're uploading a sprite to make it work
  await uploadSprites(page, { sprites: ["128x128.webp"] });

  const binsLocator = customBinsInPackedListLocator(page);
  const defaultBinLocator = defaultCustomBinInPackedListLocator(page);

  const binId = await getCustomBinId(page, binName);

  await dragAndDrop({
    src: foldersLocator,
    dst: binsLocator.filter({ hasText: binName }),
  });
  await expect(foldersInDefaultCustomBinLocator(page)).toHaveCount(0);
  await expect(foldersInSpecificBinLocator(page, { binId })).toHaveCount(1);

  await dragAndDrop({
    src: foldersLocator,
    dst: defaultBinLocator,
  });
  await expect(foldersInDefaultCustomBinLocator(page)).toHaveCount(1);
  await expect(foldersInSpecificBinLocator(page, { binId })).toHaveCount(0);

  await undo(page);
  await expect(foldersInDefaultCustomBinLocator(page)).toHaveCount(0);
  await expect(foldersInSpecificBinLocator(page, { binId })).toHaveCount(1);

  await redo(page);
  await expect(foldersInDefaultCustomBinLocator(page)).toHaveCount(1);
  await expect(foldersInSpecificBinLocator(page, { binId })).toHaveCount(0);
});
