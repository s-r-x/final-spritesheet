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
import { last } from "radash";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";

test("should render fitted and oversized sprites", async ({ page }) => {
  await navigateTo(page);
  await openPackedSpritesList(page);
  await changePackerSheetSize(page, 1024);
  await changePackerMultipackMode(page, "auto");
  const sprites = [
    "512x512.webp",
    "512x512-yellow.webp",
    "1024x1024.webp",
    "2048x2048.webp",
  ];
  await uploadSprites(page, {
    sprites,
  });
  await expect(spritesInPackedListLocator(page)).toHaveCount(sprites.length);
  await expect(binsInPackedListLocator(page)).toHaveCount(3);
  await expect(oversizedBinInPackedListLocator(page)).toBeVisible();
  await expect(oversizedSpritesInPackedListLocator(page)).toHaveCount(1);
  await expect(oversizedSpritesInPackedListLocator(page).first()).toHaveText(
    last(sprites)!,
  );
});
