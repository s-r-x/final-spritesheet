import { test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import {
  assertCannotPersistChanges,
  assertCanPersistChanges,
} from "./assertions/persistence";
import {
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_IMAGE_QUALITY,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_SUPPORTED_SHEET_SIZES,
  SUPPORTED_FRAMEWORKS,
  SUPPORTED_OUTPUT_IMAGE_FORMATS,
} from "../src/config";
import {
  changePackerAllowRot,
  changePackerEdgeSpacing,
  changePackerPot,
  changePackerSheetSize,
  changePackerSpritePadding,
} from "./fixtures/change-packer-settings";
import { persistChanges } from "./fixtures/persistence";
import {
  assertPackerAllowRotValue,
  assertPackerEdgeSpacingValue,
  assertPackerPotValue,
  assertPackerSheetSizeValue,
  assertPackerSpritePaddingValue,
} from "./assertions/packer-settings";
import {
  changeOutputDataFileName,
  changeOutputFramework,
  changeOutputImageQuality,
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

test("should persist packer settings", async ({ page }) => {
  await navigateTo(page);
  await assertCannotPersistChanges(page);
  const sheetSizeValue = String(
    PACKER_SUPPORTED_SHEET_SIZES.find(
      (size) => size !== PACKER_DEFAULT_SHEET_SIZE,
    )!,
  );
  const paddingValue = "10";
  const edgeValue = "5";
  const potValue = !PACKER_DEFAULT_POT;
  const allowRotValue = !PACKER_DEFAULT_ALLOW_ROTATION;

  await changePackerSheetSize(page, sheetSizeValue);
  await changePackerSpritePadding(page, paddingValue);
  await changePackerEdgeSpacing(page, edgeValue);
  await changePackerPot(page, potValue);
  await changePackerAllowRot(page, allowRotValue);

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  await assertPackerSheetSizeValue(page, sheetSizeValue);
  await assertPackerSpritePaddingValue(page, paddingValue);
  await assertPackerEdgeSpacingValue(page, edgeValue);
  await assertPackerPotValue(page, potValue);
  await assertPackerAllowRotValue(page, allowRotValue);
});

test("should persist output settings", async ({ page }) => {
  await navigateTo(page);
  await assertCannotPersistChanges(page);
  const frameworkValue = SUPPORTED_FRAMEWORKS.find(
    ({ value }) => value !== OUTPUT_DEFAULT_FRAMEWORK,
  )?.value!;
  const textureFormatValue = SUPPORTED_OUTPUT_IMAGE_FORMATS.find(
    (format) =>
      format !== OUTPUT_DEFAULT_TEXTURE_FORMAT &&
      // assert this to make the image quality input visible
      (format === "jpeg" || format === "webp"),
  )!;
  const dataFileName = "my data file";
  const textureFileName = "my texture file";
  const imageQuality = String(OUTPUT_DEFAULT_IMAGE_QUALITY - 1);

  await changeOutputFramework(page, frameworkValue);
  await changeOutputTextureFormat(page, textureFormatValue);
  await changeOutputDataFileName(page, dataFileName);
  await changeOutputTextureFileName(page, textureFileName);
  await changeOutputImageQuality(page, imageQuality);

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  await assertOutputFrameworkValue(page, frameworkValue);
  await assertOutputTextureFormatValue(page, textureFormatValue);
  await assertOutputDataFileNameValue(page, dataFileName);
  await assertOutputTextureFileNameValue(page, textureFileName);
  await assertOutputImageQualityValue(page, imageQuality);
});
