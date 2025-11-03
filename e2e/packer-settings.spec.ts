import { test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { undo } from "./fixtures/undo";
import {
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_MULTIPACK_MODE,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_ROTATION_SUPPORTED_FRAMEWORKS,
  PACKER_SUPPORTED_ALGORITHMS,
  PACKER_SUPPORTED_MULTIPACK_MODES,
  PACKER_SUPPORTED_SHEET_SIZES,
  SUPPORTED_OUTPUT_FRAMEWORKS,
} from "../src/config";
import { redo } from "./fixtures/redo";
import {
  changePackerAlgorithm,
  changePackerAllowRot,
  changePackerEdgeSpacing,
  changePackerMultipackMode,
  changePackerPot,
  changePackerSheetSize,
  changePackerSpritePadding,
} from "./fixtures/change-packer-settings";
import {
  assertAllowRotEnabledState,
  assertPackerAlgorithmValue,
  assertPackerAllowRotValue,
  assertPackerEdgeSpacingValue,
  assertPackerMultipackValue,
  assertPackerPotValue,
  assertPackerSheetSizeValue,
  assertPackerSpritePaddingValue,
} from "./assertions/packer-settings";
import { assertCannotRedo, assertCannotUndo } from "./assertions/history";
import { changeOutputFramework } from "./fixtures/change-output-settings";

test("should update packer settings", async ({ page }) => {
  await navigateTo(page);

  const sheetInitial = String(PACKER_DEFAULT_SHEET_SIZE);
  const paddingInitial = String(PACKER_DEFAULT_SPRITE_PADDING);
  const edgeSpacingInitial = String(PACKER_DEFAULT_EDGE_SPACING);
  const potInitial = PACKER_DEFAULT_POT;
  const algorithmInitial = PACKER_DEFAULT_ALGORITHM;
  const multipackInitial = PACKER_DEFAULT_MULTIPACK_MODE;
  const allowRotInitial = PACKER_DEFAULT_ALLOW_ROTATION;

  const sheetUpdated = PACKER_SUPPORTED_SHEET_SIZES.find(
    (size) => size !== PACKER_DEFAULT_SHEET_SIZE,
  )!;
  const algorithmUpdated = PACKER_SUPPORTED_ALGORITHMS.find(
    (alghorithm) => alghorithm !== PACKER_DEFAULT_ALGORITHM,
  )!;
  const multipackUpdated = PACKER_SUPPORTED_MULTIPACK_MODES.find(
    (mode) => mode !== PACKER_DEFAULT_MULTIPACK_MODE,
  )!;
  const paddingUpdated = "10";
  const edgeSpacingUpdated = "5";
  const potUpdated = !potInitial;
  const allowRotUpdated = !PACKER_DEFAULT_ALLOW_ROTATION;

  await changePackerSheetSize(page, sheetUpdated);
  await assertPackerSheetSizeValue(page, sheetUpdated);

  await changePackerSpritePadding(page, paddingUpdated);
  await assertPackerSpritePaddingValue(page, paddingUpdated);

  await changePackerEdgeSpacing(page, edgeSpacingUpdated);
  await assertPackerEdgeSpacingValue(page, edgeSpacingUpdated);

  await changePackerAlgorithm(page, algorithmUpdated);
  await assertPackerAlgorithmValue(page, algorithmUpdated);

  await changePackerMultipackMode(page, multipackUpdated);
  await assertPackerMultipackValue(page, multipackUpdated);

  await changePackerPot(page, potUpdated);
  await assertPackerPotValue(page, potUpdated);

  await undo(page);
  await assertPackerPotValue(page, potInitial);

  await undo(page);
  await assertPackerMultipackValue(page, multipackInitial);

  await undo(page);
  await assertPackerAlgorithmValue(page, algorithmInitial);

  await undo(page);
  await assertPackerEdgeSpacingValue(page, edgeSpacingInitial);

  await undo(page);
  await assertPackerSpritePaddingValue(page, paddingInitial);

  await undo(page);
  await assertPackerSheetSizeValue(page, sheetInitial);

  await assertCannotUndo(page);

  await redo(page);
  await assertPackerSheetSizeValue(page, sheetUpdated);

  await redo(page);
  await assertPackerSpritePaddingValue(page, paddingUpdated);

  await redo(page);
  await assertPackerEdgeSpacingValue(page, edgeSpacingUpdated);

  await redo(page);
  await assertPackerAlgorithmValue(page, algorithmUpdated);

  await redo(page);
  await assertPackerMultipackValue(page, multipackUpdated);

  await redo(page);
  await assertPackerPotValue(page, potUpdated);

  await assertCannotRedo(page);

  await changePackerAlgorithm(page, "maxRects");
  await assertPackerAllowRotValue(page, allowRotInitial);
  await changePackerAllowRot(page, allowRotUpdated);
  await assertPackerAllowRotValue(page, allowRotUpdated);
  await undo(page);
  await assertPackerAllowRotValue(page, allowRotInitial);
  await redo(page);
  await assertPackerAllowRotValue(page, allowRotUpdated);
});

test("rotation should be disabled if selected packer is not max rects", async ({
  page,
}) => {
  await navigateTo(page);

  await changePackerAlgorithm(page, "maxRects");
  await assertAllowRotEnabledState(page, true);
  await changePackerAlgorithm(page, "basic");
  await assertAllowRotEnabledState(page, false);
  // a flaky test fix
  await changePackerAlgorithm(page, "maxRects");
  await changePackerAlgorithm(page, "grid");
  await assertAllowRotEnabledState(page, false);
});

test("rotation should be disabled if output framework doesn't support this option", async ({
  page,
}) => {
  await navigateTo(page);

  for (const framework of SUPPORTED_OUTPUT_FRAMEWORKS) {
    await changeOutputFramework(page, framework);
    await assertAllowRotEnabledState(
      page,
      PACKER_ROTATION_SUPPORTED_FRAMEWORKS.has(framework),
    );
  }
});
