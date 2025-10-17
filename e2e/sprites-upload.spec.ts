import { test, expect } from "@playwright/test";
import { uploadSprites } from "./fixtures/upload-sprites";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { navigateTo } from "./fixtures/navigate-to";
import { openFoldersList } from "./fixtures/open-folders-list";
import { spritesInPackedListLocator } from "./locators/sprites-in-packed-list";
import { spritesInRootFolderLocator } from "./locators/sprites-in-folder";

test("should upload sprites", async ({ page }) => {
  await navigateTo(page);
  const sprites = ["256x256.png", "256x256.webp"];
  await uploadSprites(page, { sprites });

  const packedSpritesList = await openPackedSpritesList(page);
  await expect(spritesInPackedListLocator(page)).toHaveCount(sprites.length);
  for (const spriteName of sprites) {
    await expect(
      packedSpritesList.getByText(spriteName, { exact: true }),
    ).toBeVisible();
  }

  const foldersList = await openFoldersList(page);
  expect(spritesInRootFolderLocator(page)).toHaveCount(sprites.length);
  for (const spriteName of sprites) {
    await expect(
      foldersList.getByText(spriteName, { exact: true }),
    ).toBeVisible();
  }
});
