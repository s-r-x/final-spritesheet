import { test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { undo } from "./fixtures/undo";
import {
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
} from "../src/config";
import { redo } from "./fixtures/redo";
import {
  changePackerAllowRot,
  changePackerEdgeSpacing,
  changePackerPot,
  changePackerSheetSize,
  changePackerSpritePadding,
} from "./fixtures/change-packer-settings";
import {
  assertPackerAllowRotValue,
  assertPackerEdgeSpacingValue,
  assertPackerPotValue,
  assertPackerSheetSizeValue,
  assertPackerSpritePaddingValue,
} from "./assertions/packer-settings";
import {
  assertCannotRedo,
  assertCannotUndo,
  assertCanRedo,
  assertCanUndo,
} from "./assertions/history";

test("it should update, undo and redo packer settings", async ({ page }) => {
  type tHistoryEntry = {
    sheet: string;
    padding: string;
    edge: string;
    pot: boolean;
    allowRot: boolean;
  };
  const sheetInitialValue = String(PACKER_DEFAULT_SHEET_SIZE);
  const paddingInitialValue = String(PACKER_DEFAULT_SPRITE_PADDING);
  const edgeSpacingInitialValue = String(PACKER_DEFAULT_EDGE_SPACING);
  const potInitialValue = PACKER_DEFAULT_POT;
  const allowRotInitialValue = PACKER_DEFAULT_ALLOW_ROTATION;
  const history: tHistoryEntry[] = [
    {
      sheet: sheetInitialValue,
      padding: paddingInitialValue,
      edge: edgeSpacingInitialValue,
      pot: potInitialValue,
      allowRot: allowRotInitialValue,
    },
  ];
  const getLastHistoryEntry = () => history[history.length - 1];
  const addHistoryEntry = async (values: Partial<tHistoryEntry>) => {
    if (values.sheet) {
      await changePackerSheetSize(page, Number(values.sheet));
    }
    if (values.padding) {
      await changePackerSpritePadding(page, Number(values.padding));
    }
    if (values.edge) {
      await changePackerEdgeSpacing(page, Number(values.edge));
    }
    if (typeof values.allowRot === "boolean") {
      await changePackerAllowRot(page, values.allowRot);
    }
    if (typeof values.pot === "boolean") {
      await changePackerPot(page, values.pot);
    }
    history.push({
      ...getLastHistoryEntry(),
      ...values,
    });
  };
  const assertCurrentFormValues = async () => {
    const entry = getLastHistoryEntry();
    await assertPackerSheetSizeValue(page, entry.sheet);
    await assertPackerSpritePaddingValue(page, entry.padding);
    await assertPackerEdgeSpacingValue(page, entry.edge);
    await assertPackerPotValue(page, entry.pot);
    await assertPackerAllowRotValue(page, entry.allowRot);
  };
  await navigateTo(page);
  await assertCannotUndo(page);
  await assertCannotRedo(page);

  await assertCurrentFormValues();

  const sheetUpdatedValue = "256";
  const paddingUpdatedValue = "10";
  const edgeUpdatedValue = "5";
  const potUpdatedValue = !potInitialValue;
  const allowRotUpdatedValue = !allowRotInitialValue;

  await addHistoryEntry({ sheet: sheetUpdatedValue });
  await addHistoryEntry({ padding: paddingUpdatedValue });
  await addHistoryEntry({ edge: edgeUpdatedValue });
  await addHistoryEntry({ pot: potUpdatedValue });
  await addHistoryEntry({ allowRot: allowRotUpdatedValue });

  await assertCurrentFormValues();

  // x fields have been changed, therefore x history entries
  const numberOfMutations = 5;
  for (const _ of Array.from(Array(numberOfMutations))) {
    await undo(page);
    history.pop();
    await assertCurrentFormValues();
  }
  await assertCannotUndo(page);
  await assertCanRedo(page);
  await assertPackerSheetSizeValue(page, sheetInitialValue);
  await assertPackerSpritePaddingValue(page, paddingInitialValue);
  await assertPackerEdgeSpacingValue(page, edgeSpacingInitialValue);
  await assertPackerPotValue(page, potInitialValue);
  await assertPackerAllowRotValue(page, allowRotInitialValue);

  for (const _ of Array.from(Array(numberOfMutations))) {
    await redo(page);
  }

  await assertCannotRedo(page);
  await assertCanUndo(page);
  await assertPackerSheetSizeValue(page, sheetUpdatedValue);
  await assertPackerSpritePaddingValue(page, paddingUpdatedValue);
  await assertPackerEdgeSpacingValue(page, edgeUpdatedValue);
  await assertPackerPotValue(page, potUpdatedValue);
  await assertPackerAllowRotValue(page, allowRotUpdatedValue);
});
