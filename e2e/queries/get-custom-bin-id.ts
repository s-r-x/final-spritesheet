import type { Page } from "@playwright/test";
import { customBinsInPackedListLocator } from "../locators/packed-sprites-list";
import { invariant } from "../../src/common/utils/invariant";

export const getCustomBinId = async (page: Page, name: string) => {
  const id = await customBinsInPackedListLocator(page)
    .filter({ hasText: name })
    .getAttribute("data-node-id");
  invariant(id);
  return id;
};
