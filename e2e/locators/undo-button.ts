import type { Page } from "@playwright/test";
import { toolbarLocator } from "./toolbar";
import { t } from "../utils/t";

export const undoButtonLocator = (page: Page) => {
  return toolbarLocator(page).getByRole("button", { name: t("undo") });
};
