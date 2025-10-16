import { expect, test } from "@playwright/test";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { uploadSprites } from "./fixtures/upload-sprites";
import { selectItemsInPackedList } from "./fixtures/select-sprites-in-packed-list";
import { navigateTo } from "./fixtures/navigate-to";
import { getOrderedSpritesFromPackedBin } from "./queries/get-ordered-sprites-from-packed-bin";

test("should select sprites in a bin", async ({ page }) => {
  await navigateTo(page);
  const spritesToUpload = [
    "256x256.png",
    "256x256.webp",
    "512x512.webp",
    "1024x1024.webp",
  ];
  await uploadSprites(page, { sprites: spritesToUpload });
  const list = await openPackedSpritesList(page);
  const binOrder = await getOrderedSpritesFromPackedBin(page);
  await selectItemsInPackedList(page, {
    selection: [binOrder[0], binOrder[binOrder.length - 2]],
  });
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(
    spritesToUpload.length - 1,
  );
});
