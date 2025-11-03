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
} from "../src/config";
import { redo } from "./fixtures/redo";
import { assertCannotRedo, assertCannotUndo } from "./assertions/history";
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

test("should update output settings", async ({ page }) => {
  await navigateTo(page);
  const frameworkInitial = OUTPUT_DEFAULT_FRAMEWORK;
  const textureFormatInitial = OUTPUT_DEFAULT_TEXTURE_FORMAT;
  const dataFileInitial = OUTPUT_DEFAULT_DATA_FILE_NAME;
  const textureFileInitial = OUTPUT_DEFAULT_TEXTURE_FILE_NAME;

  await assertOutputFrameworkValue(page, frameworkInitial);
  await assertOutputTextureFormatValue(page, textureFormatInitial);
  await assertOutputDataFileNameValue(page, dataFileInitial);
  await assertOutputTextureFileNameValue(page, textureFileInitial);

  const frameworkUpdated = SUPPORTED_OUTPUT_FRAMEWORKS.find(
    (framework) => framework !== frameworkInitial,
  )!;
  const textureFormatUpdated = textureFormatInitial === "png" ? "jpeg" : "png";
  const dataFileUpdated = "my file";
  const textureFileUpdated = "my texture";

  await changeOutputFramework(page, frameworkUpdated);
  await assertOutputFrameworkValue(page, frameworkUpdated);
  await changeOutputTextureFormat(page, textureFormatUpdated);
  await assertOutputTextureFormatValue(page, textureFormatUpdated);
  await changeOutputDataFileName(page, dataFileUpdated);
  await assertOutputDataFileNameValue(page, dataFileUpdated);
  await changeOutputTextureFileName(page, textureFileUpdated);
  await assertOutputTextureFileNameValue(page, textureFileUpdated);

  await undo(page);
  await assertOutputTextureFileNameValue(page, textureFileInitial);

  await undo(page);
  await assertOutputDataFileNameValue(page, dataFileInitial);

  await undo(page);
  await assertOutputTextureFormatValue(page, textureFormatInitial);

  await undo(page);
  assertOutputFrameworkValue(page, frameworkInitial);

  await assertCannotUndo(page);

  await redo(page);
  await assertOutputFrameworkValue(page, frameworkUpdated);

  await redo(page);
  await assertOutputTextureFormatValue(page, textureFormatUpdated);

  await redo(page);
  await assertOutputDataFileNameValue(page, dataFileUpdated);

  await redo(page);
  await assertOutputFrameworkValue(page, frameworkUpdated);

  await assertCannotRedo(page);
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
