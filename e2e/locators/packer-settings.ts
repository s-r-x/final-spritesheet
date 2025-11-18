import type { Page } from "@playwright/test";
import { t } from "../utils/t";

export const packerSettingsFormLocator = (page: Page) => {
  return page.getByTestId("packer-settings-form");
};

export const packerAlgorithmLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByLabel(
    t("packer_opts.packer_algorithm"),
  );
};
export const packerSheetSizeLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByLabel(t("packer_opts.max_size"));
};
export const packerSpritePaddingLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByLabel(
    t("packer_opts.sprite_padding"),
  );
};
export const packerEdgeSpacingLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByLabel(
    t("packer_opts.edge_spacing"),
  );
};
export const packerPotLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByRole("checkbox", {
    name: t("packer_opts.pot"),
  });
};
export const packerSquareLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByRole("checkbox", {
    name: t("packer_opts.square"),
  });
};
export const packerAllowRotLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByRole("checkbox", {
    name: t("packer_opts.allow_rot"),
  });
};
export const packerMultipackModeLocator = (page: Page) => {
  return packerSettingsFormLocator(page).getByLabel(t("packer_opts.multipack"));
};
