import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { normalizeAssetName } from "../utils/normalize-asset-name";

export const uploadSprites = async (
  page: Page,
  { sprites }: { sprites: string[] },
) => {
  const filePaths = sprites.map(normalizeAssetName);
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("toolbar").getByText(t("add_sprites")).click(),
  ]);

  await fileChooser.setFiles(filePaths);
};
