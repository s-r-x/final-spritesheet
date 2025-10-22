import { expect, test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { undo } from "./fixtures/undo";
import {
  OUTPUT_DEFAULT_DATA_FILE_NAME,
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_IMAGE_QUALITY,
  OUTPUT_DEFAULT_TEXTURE_FILE_NAME,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
  SUPPORTED_OUTPUT_FRAMEWORKS,
  SUPPORTED_OUTPUT_IMAGE_FORMATS,
} from "../src/config";
import { redo } from "./fixtures/redo";
import {
  assertCannotRedo,
  assertCannotUndo,
  assertCanRedo,
  assertCanUndo,
} from "./assertions/history";
import {
  changeOutputDataFileName,
  changeOutputFramework,
  changeOutputTextureFileName,
  changeOutputTextureFormat,
} from "./fixtures/change-output-settings";
import {
  assertOutputDataFileNameValue,
  assertOutputFrameworkValue,
  assertOutputImageQualityValue,
  assertOutputTextureFileNameValue,
  assertOutputTextureFormatValue,
} from "./assertions/output-settings";
import { outputImageQualityLocator } from "./locators/output-settings";

test("should update, undo and redo output settings", async ({ page }) => {
  await navigateTo(page);

  type tHistoryEntry = {
    framework: string;
    textureFormat: string;
    dataFile: string;
    textureFile: string;
  };
  const frameworkInitialValue = String(OUTPUT_DEFAULT_FRAMEWORK);
  const textureFormatInitialValue = String(OUTPUT_DEFAULT_TEXTURE_FORMAT);
  const dataFileNameInitialValue = String(OUTPUT_DEFAULT_DATA_FILE_NAME);
  const textureFileNameInitialValue = OUTPUT_DEFAULT_TEXTURE_FILE_NAME;
  const history: tHistoryEntry[] = [
    {
      framework: frameworkInitialValue,
      textureFormat: textureFormatInitialValue,
      dataFile: dataFileNameInitialValue,
      textureFile: textureFileNameInitialValue,
    },
  ];
  const getLastHistoryEntry = () => history[history.length - 1];
  const addHistoryEntry = async (values: Partial<tHistoryEntry>) => {
    if (values.framework) {
      await changeOutputFramework(page, values.framework);
    }
    if (values.textureFormat) {
      await changeOutputTextureFormat(page, values.textureFormat);
    }
    if (values.dataFile) {
      await changeOutputDataFileName(page, values.dataFile);
    }
    if (values.textureFile) {
      await changeOutputTextureFileName(page, values.textureFile);
    }
    history.push({
      ...getLastHistoryEntry(),
      ...values,
    });
  };

  const assertFormValues = async (entry: tHistoryEntry) => {
    await assertOutputFrameworkValue(page, entry.framework);
    await assertOutputTextureFormatValue(page, entry.textureFormat);
    await assertOutputDataFileNameValue(page, entry.dataFile);
    await assertOutputTextureFileNameValue(page, entry.textureFile);
  };
  const assertLastHistoryEntryValues = async () => {
    const entry = getLastHistoryEntry();
    await assertFormValues(entry);
  };
  await assertCannotUndo(page);
  await assertCannotRedo(page);

  await assertLastHistoryEntryValues();

  const frameworkUpdatedValue = SUPPORTED_OUTPUT_FRAMEWORKS.find(
    (framework) => framework !== frameworkInitialValue,
  )!;
  const textureFormatUpdatedValue = SUPPORTED_OUTPUT_IMAGE_FORMATS.find(
    (format) => format !== textureFormatInitialValue,
  )!;
  const dataFileNameUpdatedValue = "new data file name";
  const textureFileNameUpdatedValue = "new texture file name";

  await addHistoryEntry({ framework: frameworkUpdatedValue });
  await addHistoryEntry({ textureFormat: textureFormatUpdatedValue });
  await addHistoryEntry({ dataFile: dataFileNameUpdatedValue });
  await addHistoryEntry({ textureFile: textureFileNameUpdatedValue });

  await assertLastHistoryEntryValues();

  // x fields have been changed, therefore x history entries
  const numberOfMutations = 4;
  for (const _ of Array.from(Array(numberOfMutations))) {
    await undo(page);
    history.pop();
    await assertLastHistoryEntryValues();
  }
  await assertCannotUndo(page);
  await assertCanRedo(page);
  await assertFormValues({
    framework: frameworkInitialValue,
    textureFormat: textureFormatInitialValue,
    dataFile: dataFileNameInitialValue,
    textureFile: textureFileNameInitialValue,
  });

  for (const _ of Array.from(Array(numberOfMutations))) {
    await redo(page);
  }

  await assertCannotRedo(page);
  await assertCanUndo(page);
  await assertFormValues({
    framework: frameworkUpdatedValue,
    textureFormat: textureFormatUpdatedValue,
    dataFile: dataFileNameUpdatedValue,
    textureFile: textureFileNameUpdatedValue,
  });
});
test("should show the image quality input only if the selected texture format supports that feature", async ({
  page,
}) => {
  await navigateTo(page);

  for (const textureFormat of ["jpeg", "webp"]) {
    await changeOutputTextureFormat(page, textureFormat);
    await assertOutputImageQualityValue(
      page,
      String(OUTPUT_DEFAULT_IMAGE_QUALITY),
    );
  }
  await changeOutputTextureFormat(page, "png");

  await expect(outputImageQualityLocator(page)).not.toBeAttached();
});
