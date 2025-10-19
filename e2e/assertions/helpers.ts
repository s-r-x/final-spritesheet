import { expect, type Locator } from "@playwright/test";

export const assertCheckboxValue = async (loc: Locator, value: boolean) => {
  if (value) {
    await expect(loc).toBeChecked();
  } else {
    await expect(loc).not.toBeChecked();
  }
};
