import type { Page } from "@playwright/test";
import { t } from "../utils/t";

export const outputSettingsFormLocator = (page: Page) => {
  return page.getByTestId("output-settings-form");
};

export const outputFrameworkLocator = (page: Page) => {
  return outputSettingsFormLocator(page).getByLabel(t("output_opts.framework"));
};
export const outputTextureFormatLocator = (page: Page) => {
  return outputSettingsFormLocator(page).getByLabel(
    t("output_opts.texture_format"),
  );
};
export const outputImageQualityLocator = (page: Page) => {
  return outputSettingsFormLocator(page).getByLabel(
    t("output_opts.image_quality"),
  );
};
export const outputDataFileNameLocator = (page: Page) => {
  return outputSettingsFormLocator(page).getByLabel(t("output_opts.data_file"));
};
export const outputTextureFileNameLocator = (page: Page) => {
  return outputSettingsFormLocator(page).getByLabel(
    t("output_opts.texture_file"),
  );
};
