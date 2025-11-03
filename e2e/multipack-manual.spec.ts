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
  oversizedSpritesInPackedListLocator,
  spritesInDefaultCustomBinLocator,
  spritesInPackedListLocator,
  spritesInSpecificBinLocator,
} from "./locators/packed-sprites-list";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { removeCustomBin } from "./fixtures/custom-bins";
import { updateCustomBinWorkflow } from "./workflows/update-custom-bin";
import { createCustomBinWorkflow } from "./workflows/create-custom-bin";
import { getCustomBinId } from "./queries/get-custom-bin-id";
import { invariant } from "../src/common/utils/invariant";
import { getOrderedSpritesFromPackedBin } from "./queries/get-ordered-sprites-from-packed-bin";
import { selectItemsInPackedList } from "./fixtures/select-sprites";

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
  const spriteLocator = spritesInPackedListLocator(page);
  const binLocator = customBinsInPackedListLocator(page).filter({
    hasText: binName,
  });
  const binId = await getCustomBinId(page, binName);
  invariant(binId);
  const orderedSprites = (await getOrderedSpritesFromPackedBin(page)) as [
    string,
    string,
  ];
  await selectItemsInPackedList(page, { selection: orderedSprites });
  await spriteLocator.first().dragTo(binLocator);
  await expect(spritesInDefaultCustomBinLocator(page)).toHaveCount(0);
  await expect(spritesInSpecificBinLocator(page, { binId })).toHaveCount(2);

  {
    const orderedSprites = (await getOrderedSpritesFromPackedBin(page)) as [
      string,
      string,
    ];
    await selectItemsInPackedList(page, { selection: orderedSprites });
    await spriteLocator
      .first()
      .dragTo(defaultCustomBinInPackedListLocator(page));
    await expect(spritesInDefaultCustomBinLocator(page)).toHaveCount(2);
    await expect(spritesInSpecificBinLocator(page, { binId })).toHaveCount(0);
  }
});
