import { expect, test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import {
  assertCannotPersistChanges,
  assertCanPersistChanges,
} from "./assertions/persistence";
import {
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_IMAGE_QUALITY,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_MULTIPACK_MODE,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SQUARE,
  PACKER_SUPPORTED_ALGORITHMS,
  PACKER_SUPPORTED_MULTIPACK_MODES,
  PACKER_SUPPORTED_SHEET_SIZES,
  SUPPORTED_OUTPUT_FRAMEWORKS,
  SUPPORTED_OUTPUT_IMAGE_FORMATS,
} from "../src/config";
import {
  changePackerAlgorithm,
  changePackerAllowRot,
  changePackerMultipackMode,
} from "./fixtures/change-packer-settings";
import { persistChanges } from "./fixtures/persistence";
import {
  assertPackerAlgorithmValue,
  assertPackerAllowRotValue,
  assertPackerEdgeSpacingValue,
  assertPackerMultipackValue,
  assertPackerPotValue,
  assertPackerSheetSizeValue,
  assertPackerSpritePaddingValue,
  assertPackerSquareValue,
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
import { createCustomBinWorkflow } from "./workflows/create-custom-bin";
import {
  customBinsInPackedListLocator,
  spritesInSpecificBinLocator,
} from "./locators/packed-sprites-list";
import { createFolderWorkflow } from "./workflows/create-folder";
import { openFoldersList } from "./fixtures/open-folders-list";
import { foldersInFoldersListLocator } from "./locators/folders-list";
import { removeFolder, uploadSpritesToFolder } from "./fixtures/folders";
import { spritesInFolderLocator } from "./locators/sprites-in-folder";
import {
  removeCustomBin,
  uploadSpritesToCustomBin,
} from "./fixtures/custom-bins";
import { getCustomBinId } from "./queries/get-custom-bin-id";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { updatePackerSettingsWorkflow } from "./workflows/update-packer-settings";
import { updateOutputSettingsWorkflow } from "./workflows/update-output-settings";

test.beforeEach(async ({ page }) => {
  await navigateTo(page);
  await assertCannotPersistChanges(page);
});
test("should persist packer settings", async ({ page }) => {
  const sheetSizeValue = String(
    PACKER_SUPPORTED_SHEET_SIZES.find(
      (size) => size !== PACKER_DEFAULT_SHEET_SIZE,
    )!,
  );
  const paddingValue = "10";
  const edgeValue = "5";
  const potValue = !PACKER_DEFAULT_POT;
  const allowRotValue = !PACKER_DEFAULT_ALLOW_ROTATION;
  const squareValue = !PACKER_DEFAULT_SQUARE;
  const algorithmValue = PACKER_SUPPORTED_ALGORITHMS.find(
    (alg) => alg !== PACKER_DEFAULT_ALGORITHM,
  )!;
  const multipackValue = PACKER_SUPPORTED_MULTIPACK_MODES.find(
    (mode) => mode !== PACKER_DEFAULT_MULTIPACK_MODE,
  )!;

  await updatePackerSettingsWorkflow(page, {
    algorithm: algorithmValue,
    sheetSize: sheetSizeValue,
    spritePadding: paddingValue,
    edgeSpacing: edgeValue,
    pot: potValue,
    multipack: multipackValue,
    square: squareValue,
  });

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  await assertPackerSheetSizeValue(page, sheetSizeValue);
  await assertPackerAlgorithmValue(page, algorithmValue);
  await assertPackerSpritePaddingValue(page, paddingValue);
  await assertPackerEdgeSpacingValue(page, edgeValue);
  await assertPackerPotValue(page, potValue);
  await assertPackerMultipackValue(page, multipackValue);
  await assertPackerSquareValue(page, squareValue);

  await changePackerAlgorithm(page, "maxRects");
  await changePackerAllowRot(page, allowRotValue);

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  await assertPackerAllowRotValue(page, allowRotValue);
});

test("should persist output settings", async ({ page }) => {
  const framework = SUPPORTED_OUTPUT_FRAMEWORKS.find(
    (value) => value !== OUTPUT_DEFAULT_FRAMEWORK,
  )!;
  const textureFormat = SUPPORTED_OUTPUT_IMAGE_FORMATS.find(
    (format) =>
      format !== OUTPUT_DEFAULT_TEXTURE_FORMAT &&
      // assert this to make the image quality input visible
      (format === "jpeg" || format === "webp"),
  )!;
  const dataFileName = "my data file";
  const textureFileName = "my texture file";
  const imageQuality = String(OUTPUT_DEFAULT_IMAGE_QUALITY - 1);

  await changeOutputFramework(page, framework);
  await changeOutputTextureFormat(page, textureFormat);
  await changeOutputDataFileName(page, dataFileName);
  await changeOutputTextureFileName(page, textureFileName);
  await changeOutputImageQuality(page, imageQuality);
  await updateOutputSettingsWorkflow(page, {
    framework: framework,
    textureFormat: textureFormat,
    dataFileName: dataFileName,
    textureFileName,
    imageQuality,
  });

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  await assertOutputFrameworkValue(page, framework);
  await assertOutputTextureFormatValue(page, textureFormat);
  await assertOutputDataFileNameValue(page, dataFileName);
  await assertOutputTextureFileNameValue(page, textureFileName);
  await assertOutputImageQualityValue(page, imageQuality);
});
test("should persist folders and sprites inside them", async ({ page }) => {
  await openFoldersList(page);
  const folders = ["folder 1", "folder 2", "folder 3"];
  for (const folderName of folders) {
    await createFolderWorkflow(page, { data: { name: folderName } });
  }
  const spriteName = "128x128.webp";
  await uploadSpritesToFolder(page, {
    folderName: folders[0],
    sprites: [spriteName],
  });
  await removeFolder(page, { name: folders[2] });
  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();

  const foldersLoc = foldersInFoldersListLocator(page);
  // minus the removed folder plus the default one
  await expect(foldersLoc).toHaveCount(folders.length);
  for (const folderName of folders.slice(0, -1)) {
    await expect(foldersLoc.filter({ hasText: folderName })).toBeAttached();
  }
  const spritesInFirstFolderLoc = await spritesInFolderLocator(page, {
    folderName: folders[0],
  });
  await expect(spritesInFirstFolderLoc).toHaveCount(1);
});
test("should persist custom bins and sprites inside them", async ({ page }) => {
  await openPackedSpritesList(page);
  await changePackerMultipackMode(page, "manual");
  const bins = ["bin 1", "bin 2", "bin 3"];
  for (const name of bins) {
    await createCustomBinWorkflow(page, { data: { name } });
  }

  await uploadSpritesToCustomBin(page, {
    binName: bins[0],
    sprites: ["128x128.webp"],
  });

  await removeCustomBin(page, bins[2]);

  await assertCanPersistChanges(page);
  await persistChanges(page);
  await assertCannotPersistChanges(page);

  await page.reload();
  const customBinsLoc = customBinsInPackedListLocator(page);
  // minus the removed bin plus the default one
  await expect(customBinsLoc).toHaveCount(bins.length);

  for (const binName of bins.slice(0, -1)) {
    await expect(customBinsLoc.filter({ hasText: binName })).toBeAttached();
  }

  const binId = await getCustomBinId(page, bins[0]);
  await expect(spritesInSpecificBinLocator(page, { binId })).toHaveCount(1);
});
