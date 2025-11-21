import type { Page } from "@playwright/test";
import { isDefined } from "../utils/is-defined";
import {
  changePackerAlgorithm,
  changePackerAllowRot,
  changePackerEdgeSpacing,
  changePackerMultipackMode,
  changePackerPot,
  changePackerSheetSize,
  changePackerSpritePadding,
  changePackerSquare,
} from "../fixtures/change-packer-settings";
import { isBoolean } from "../../src/common/utils/is-boolean";
import type { tPackerAlgorithm, tPackerMultipackMode } from "../../src/config";

export const updatePackerSettingsWorkflow = async (
  page: Page,
  {
    spritePadding,
    square,
    pot,
    allowRotation,
    edgeSpacing,
    sheetSize,
    multipack,
    algorithm,
  }: {
    spritePadding?: number | string;
    square?: boolean;
    pot?: boolean;
    allowRotation?: boolean;
    edgeSpacing?: number | string;
    sheetSize?: number | string;
    multipack?: tPackerMultipackMode;
    algorithm?: tPackerAlgorithm;
  },
) => {
  if (isDefined(spritePadding)) {
    await changePackerSpritePadding(page, spritePadding);
  }
  if (isBoolean(square)) {
    await changePackerSquare(page, square);
  }
  if (isBoolean(pot)) {
    await changePackerPot(page, pot);
  }
  if (isBoolean(allowRotation)) {
    await changePackerAllowRot(page, allowRotation);
  }
  if (isDefined(edgeSpacing)) {
    await changePackerEdgeSpacing(page, edgeSpacing);
  }
  if (isDefined(sheetSize)) {
    await changePackerSheetSize(page, sheetSize);
  }
  if (isDefined(multipack)) {
    await changePackerMultipackMode(page, multipack);
  }
  if (isDefined(algorithm)) {
    await changePackerAlgorithm(page, algorithm);
  }
};
