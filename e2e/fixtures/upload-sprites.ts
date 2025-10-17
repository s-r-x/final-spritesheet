import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { normalizeAssetName } from "../utils/normalize-asset-name";
import { toolbarLocator } from "../locators/toolbar";

export const uploadSprites = async (
  page: Page,
  { sprites }: { sprites: string[] },
) => {
  const filePaths = sprites.map(normalizeAssetName);
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    toolbarLocator(page).getByText(t("add_sprites")).click(),
  ]);

  await fileChooser.setFiles(filePaths);
};
