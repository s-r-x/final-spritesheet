import { test, expect } from "@playwright/test";
import { uploadSprites } from "./fixtures/upload-sprites";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { navigateTo } from "./fixtures/navigate-to";

test("it should upload sprites", async ({ page }) => {
  await navigateTo(page, { path: "/projects" });
  const sprites = ["256x256.png", "256x256.webp"];
  await uploadSprites(page, { sprites });
  const list = await openPackedSpritesList(page);
  const uploadedCount = await list.getByRole("treeitem", { level: 2 }).count();
  expect(uploadedCount).toEqual(sprites.length);
  for (const spriteName of sprites) {
    await expect(list.getByText(spriteName)).toBeVisible();
  }
});
