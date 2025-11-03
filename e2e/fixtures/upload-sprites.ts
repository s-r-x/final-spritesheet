import type { Page } from "@playwright/test";
import { t } from "../utils/t";
import { toolbarLocator } from "../locators/toolbar";
import { generateImage } from "../utils/generate-image";

export const uploadSprites = async (
  page: Page,
  { sprites }: { sprites: string[] },
) => {
  const filePaths = await Promise.all(sprites.map(generateImage));
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    toolbarLocator(page).getByText(t("add_sprites")).click(),
  ]);

  await fileChooser.setFiles(filePaths);
};
