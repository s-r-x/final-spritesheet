import { test, expect } from "@playwright/test";
import { uploadSprites } from "./fixtures/upload-sprites";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { navigateTo } from "./fixtures/navigate-to";
import { openPackedSpritesListCtxMenu } from "./fixtures/open-ctx-menu";
import { t } from "./utils/t";
import { openFoldersList } from "./fixtures/open-folders-list";
import { spritesInPackedListLocator } from "./locators/sprites-in-packed-list";
import { spritesInRootFolderLocator } from "./locators/sprites-in-folder";
import { getOrderedSpritesFromPackedBin } from "./queries/get-ordered-sprites-from-packed-bin";
import { selectItemsInPackedList } from "./fixtures/select-sprites-in-packed-list";

test("should remove sprites from a bin", async ({ page }) => {
  await navigateTo(page);
  const sprites = ["256x256.png", "256x256.webp", "512x512.webp"];
  await uploadSprites(page, { sprites });

  await openPackedSpritesList(page);
  const orderedSprites = await getOrderedSpritesFromPackedBin(page);
  const notRemovedSprite = orderedSprites[orderedSprites.length - 1];
  await selectItemsInPackedList(page, {
    selection: [orderedSprites[0], orderedSprites[orderedSprites.length - 2]],
  });
  const ctxMenu = await openPackedSpritesListCtxMenu(page, {
    spriteName: orderedSprites[0],
  });
  await ctxMenu.getByText(t("remove")).click();
  const lengthAfterRemoval = 1;

  const packedSprites = spritesInPackedListLocator(page);
  await expect(packedSprites).toHaveCount(lengthAfterRemoval);
  await expect(packedSprites.getByText(notRemovedSprite)).toBeVisible();

  await openFoldersList(page);
  const spritesInFolder = spritesInRootFolderLocator(page);
  await expect(spritesInFolder.getByText(notRemovedSprite)).toBeVisible();
  await expect(spritesInFolder).toHaveCount(lengthAfterRemoval);
});
test("should purge all sprites from a bin", async ({ page }) => {
  await navigateTo(page);
  const sprites = ["256x256.png", "256x256.webp"];
  await uploadSprites(page, { sprites });

  await openPackedSpritesList(page);
  const ctxMenu = await openPackedSpritesListCtxMenu(page, {
    binName: t("packed_bin_with_id", { id: 1 }),
  });
  await ctxMenu.getByText(t("clear_packed_bin")).click();
  const lengthAfterRemoval = 0;

  const packedSprites = spritesInPackedListLocator(page);
  await expect(packedSprites).toHaveCount(lengthAfterRemoval);
});
