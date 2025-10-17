import { expect, type Locator, test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { changePackerSheetSize } from "./fixtures/change-packer-sheet-size";
import {
  packerEdgeSpacingLocator,
  packerPotLocator,
  packerRotationLocator,
  packerSheetSizeLocator,
  packerSpritePaddingLocator,
} from "./locators/packer-settings-form";
import { undo } from "./fixtures/undo";
import {
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
} from "../src/config";
import { redo } from "./fixtures/redo";
import { undoButtonLocator } from "./locators/undo-button";
import { redoButtonLocator } from "./locators/redo-button";
import { changePackerSpritePadding } from "./fixtures/change-packer-sprite-padding";
import { changePackerEdgeSpacing } from "./fixtures/change-packer-edge-spacing";

test("it should update, undo and redo packer settings", async ({ page }) => {
  const sheetSize = packerSheetSizeLocator(page);
  const padding = packerSpritePaddingLocator(page);
  const edgeSpacing = packerEdgeSpacingLocator(page);
  const pot = packerPotLocator(page);
  const allowRot = packerRotationLocator(page);
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
      if (values.allowRot) {
        await allowRot.check();
      } else {
        await allowRot.uncheck();
      }
    }
    if (typeof values.pot === "boolean") {
      if (values.allowRot) {
        await pot.check();
      } else {
        await pot.uncheck();
      }
    }
    history.push({
      ...getLastHistoryEntry(),
      ...values,
    });
  };
  const assertCheckboxValue = async (loc: Locator, value: boolean) => {
    if (value) {
      await expect(loc).toBeChecked();
    } else {
      await expect(loc).not.toBeChecked();
    }
  };
  const assertValues = async () => {
    const entry = getLastHistoryEntry();
    await expect(sheetSize).toHaveValue(entry.sheet);
    await expect(padding).toHaveValue(entry.padding);
    await expect(edgeSpacing).toHaveValue(entry.edge);
    await assertCheckboxValue(pot, entry.pot);
    await assertCheckboxValue(allowRot, entry.allowRot);
  };
  await navigateTo(page);
  const undoBtn = undoButtonLocator(page);
  const redoBtn = redoButtonLocator(page);
  await expect(undoBtn).toBeDisabled();
  await expect(redoBtn).toBeDisabled();

  await assertValues();

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

  await assertValues();

  // x fields have been changed, therefore x history entries
  const numberOfMutations = 5;
  for (const _ of Array.from(Array(numberOfMutations))) {
    await undo(page);
    history.pop();
    await assertValues();
  }
  await expect(undoBtn).toBeDisabled();
  await expect(redoBtn).toBeEnabled();
  await expect(sheetSize).toHaveValue(sheetInitialValue);
  await expect(padding).toHaveValue(paddingInitialValue);
  await expect(edgeSpacing).toHaveValue(edgeSpacingInitialValue);
  await assertCheckboxValue(pot, potInitialValue);
  await assertCheckboxValue(allowRot, allowRotInitialValue);

  for (const _ of Array.from(Array(numberOfMutations))) {
    await redo(page);
  }
  await expect(redoBtn).toBeDisabled();
  await expect(undoBtn).toBeEnabled();
  await expect(sheetSize).toHaveValue(sheetUpdatedValue);
  await expect(padding).toHaveValue(paddingUpdatedValue);
  await expect(edgeSpacing).toHaveValue(edgeUpdatedValue);
  await assertCheckboxValue(pot, potUpdatedValue);
  await assertCheckboxValue(allowRot, allowRotUpdatedValue);
});
