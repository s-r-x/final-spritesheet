import type { Page } from "@playwright/test";
import { t } from "../utils/t";

const formI18Ns = "custom_bin_editor.";
export const createCustomBinBtnLocator = (page: Page) => {
  return page.getByText(t("add_custom_bin"));
};

export const customBinEditorFormLocator = (page: Page) => {
  return page.getByRole("dialog").locator("form");
};
export const customBinEditorNameLocator = (page: Page) => {
  return customBinEditorFormLocator(page).getByLabel(t(formI18Ns + "name"));
};

export const customBinEditorUseGlobalPackerSettingsLocator = (page: Page) => {
  return customBinEditorFormLocator(page).getByLabel(
    t(formI18Ns + "use_global_packer_settings"),
  );
};
