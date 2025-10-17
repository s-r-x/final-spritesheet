import type { Page } from "@playwright/test";
import { packerEdgeSpacingLocator } from "../locators/packer-settings-form";

export const changePackerEdgeSpacing = async (
  page: Page,
  edgeSpacing: number,
) => {
  const label = packerEdgeSpacingLocator(page);
  await label.fill(String(edgeSpacing));
  await label.press("Enter");
};
