import { test, expect } from "@playwright/test";
import { uploadSprites } from "./fixtures/upload-sprites";
import {
  changePackerMultipackMode,
  changePackerSheetSize,
} from "./fixtures/change-packer-settings";
import { navigateTo } from "./fixtures/navigate-to";
import {
  binsInPackedListLocator,
  oversizedBinInPackedListLocator,
  oversizedSpritesInPackedListLocator,
  spritesInPackedListLocator,
} from "./locators/packed-sprites-list";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";

test("should render fitted and oversized sprites", async ({ page }) => {
  await navigateTo(page);
  await openPackedSpritesList(page);
  await changePackerSheetSize(page, 1024);
  await changePackerMultipackMode(page, "off");
  const sprites = ["512x512.webp", "1024x1024.webp", "512x512-blue.webp"];
  await uploadSprites(page, {
    sprites,
  });
  await expect(spritesInPackedListLocator(page)).toHaveCount(sprites.length);
  await expect(binsInPackedListLocator(page)).toHaveCount(2);
  await expect(oversizedBinInPackedListLocator(page)).toBeVisible();
  await expect(oversizedSpritesInPackedListLocator(page)).toHaveCount(2);
});
