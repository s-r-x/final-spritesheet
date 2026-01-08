import type { Page } from "@playwright/test";
import { toolbarLocator } from "./toolbar";
import { t } from "../utils/t";

export const exportButtonLocator = (page: Page) => {
  return toolbarLocator(page).getByRole("button", { name: t("export") });
};
