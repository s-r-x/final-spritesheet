import { expect, test } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { assertCannotPersistChanges } from "./assertions/persistence";
import {
  OUTPUT_DEFAULT_FRAMEWORK,
  OUTPUT_DEFAULT_TEXTURE_FORMAT,
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SQUARE,
  PACKER_SUPPORTED_ALGORITHMS,
  PACKER_SUPPORTED_SHEET_SIZES,
  SUPPORTED_OUTPUT_FRAMEWORKS,
  type tPackerMultipackMode,
} from "../src/config";
import { persistChanges } from "./fixtures/persistence";
import { createCustomBinWorkflow } from "./workflows/create-custom-bin";
import {
  customBinsInPackedListLocator,
  spritesInPackedListLocator,
  spritesInSpecificBinLocator,
} from "./locators/packed-sprites-list";
import { createFolderWorkflow } from "./workflows/create-folder";
import { openFoldersList } from "./fixtures/open-folders-list";
import { uploadSpritesToFolder } from "./fixtures/folders";
import { uploadSpritesToCustomBin } from "./fixtures/custom-bins";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { downloadBackup, restoreFromBackup } from "./fixtures/backup";
import { updateProjectWorkflow } from "./workflows/update-project";
import { t } from "./utils/t";
import { assertActiveProjectName } from "./assertions/projects";
import { updatePackerSettingsWorkflow } from "./workflows/update-packer-settings";
import { updateOutputSettingsWorkflow } from "./workflows/update-output-settings";
import {
  assertPackerAlgorithmValue,
  assertPackerEdgeSpacingValue,
  assertPackerMultipackValue,
  assertPackerPotValue,
  assertPackerSheetSizeValue,
  assertPackerSpritePaddingValue,
  assertPackerSquareValue,
} from "./assertions/packer-settings";
import {
  assertOutputDataFileNameValue,
  assertOutputFrameworkValue,
  assertOutputImageQualityValue,
  assertOutputTextureFileNameValue,
  assertOutputTextureFormatValue,
} from "./assertions/output-settings";
import {
  foldersInFoldersListLocator,
  spritesInFoldersListLocator,
  spritesInSpecificFolderLocator,
} from "./locators/folders-list";
import { getFolderId } from "./queries/get-folder-id";
import { getCustomBinId } from "./queries/get-custom-bin-id";

test.beforeEach(async ({ page }) => {
  await navigateTo(page);
});

test.describe.configure({ mode: "serial" });

let backupPath: string;

const folderNames = ["folder 1", "folder 2"];
const customBinNames = ["bin 1", "bin 2"];

const projectName = "my project";

const packerPadding = "15";
const packerPot = !PACKER_DEFAULT_POT;
const packerSquare = !PACKER_DEFAULT_SQUARE;
const packerEdgeSpacing = "3";
const packerSheetSize = PACKER_SUPPORTED_SHEET_SIZES.find(
  (size) => size !== PACKER_DEFAULT_SHEET_SIZE,
)!;
const packerAlgorithm = PACKER_SUPPORTED_ALGORITHMS.find(
  (alghorithm) => alghorithm !== PACKER_DEFAULT_ALGORITHM,
)!;
const multipackMode: tPackerMultipackMode = "manual";

const outputFramework = SUPPORTED_OUTPUT_FRAMEWORKS.find(
  (framework) => framework !== OUTPUT_DEFAULT_FRAMEWORK,
)!;
const outputTextureFormat =
  OUTPUT_DEFAULT_TEXTURE_FORMAT === "png" ? "jpeg" : "webp";
const outputDataFile = "my-data-file";
const outputTextureFile = "my-texture-file";
const outputImageQuality = "42";

const spritesInFolder1 = ["8x8.webp", "9x9.webp"];
const spritesInBin1 = ["10x10.webp", "11x11.webp", "12x12.webp"];
test("should download backup with some data", async ({ page }) => {
  await updateProjectWorkflow(page, { data: { name: projectName } });

  await openFoldersList(page);
  for (const folder of folderNames) {
    await createFolderWorkflow(page, { data: { name: folder } });
  }
  await uploadSpritesToFolder(page, {
    folderName: folderNames[0],
    sprites: spritesInFolder1,
  });

  await openPackedSpritesList(page);

  await updatePackerSettingsWorkflow(page, {
    spritePadding: packerPadding,
    pot: packerPot,
    square: packerSquare,
    edgeSpacing: packerEdgeSpacing,
    multipack: multipackMode,
    sheetSize: packerSheetSize,
    algorithm: packerAlgorithm,
  });

  await updateOutputSettingsWorkflow(page, {
    framework: outputFramework,
    textureFormat: outputTextureFormat,
    dataFileName: outputDataFile,
    textureFileName: outputTextureFile,
    imageQuality: outputImageQuality,
  });

  for (const bin of customBinNames) {
    await createCustomBinWorkflow(page, { data: { name: bin } });
  }
  await uploadSpritesToCustomBin(page, {
    binName: customBinNames[0],
    sprites: spritesInBin1,
  });

  // ensure the sprites are present before saving the changes
  await expect(spritesInPackedListLocator(page)).toHaveCount(
    spritesInBin1.length + spritesInFolder1.length,
  );

  await persistChanges(page);
  await assertCannotPersistChanges(page);

  const { backupPath: path } = await downloadBackup(page);
  backupPath = path;
});
test("should restore from backup", async ({ page }) => {
  await restoreFromBackup(page, { backupPath });

  await page
    .getByText(t("backup.restore_success"))
    .waitFor({ state: "visible" });

  await assertActiveProjectName(page, projectName);

  await assertPackerSpritePaddingValue(page, packerPadding);
  await assertPackerPotValue(page, packerPot);
  await assertPackerSquareValue(page, packerSquare);
  await assertPackerEdgeSpacingValue(page, packerEdgeSpacing);
  await assertPackerSheetSizeValue(page, packerSheetSize);
  await assertPackerAlgorithmValue(page, packerAlgorithm);
  await assertPackerMultipackValue(page, multipackMode);

  await assertOutputFrameworkValue(page, outputFramework);
  await assertOutputTextureFormatValue(page, outputTextureFormat);
  await assertOutputTextureFileNameValue(page, outputTextureFile);
  await assertOutputDataFileNameValue(page, outputDataFile);
  await assertOutputImageQualityValue(page, outputImageQuality);

  await openFoldersList(page);
  await expect(foldersInFoldersListLocator(page)).toHaveCount(
    folderNames.length + 1,
  );
  for (const folderName of folderNames) {
    await expect(
      foldersInFoldersListLocator(page).filter({ hasText: folderName }),
    ).toBeVisible();
  }
  const firstFolderId = await getFolderId(page, folderNames[0]);
  await expect(
    spritesInSpecificFolderLocator(page, { folderId: firstFolderId }),
  ).toHaveCount(spritesInFolder1.length);
  for (const sprite of spritesInFolder1) {
    await expect(
      spritesInFoldersListLocator(page).filter({ hasText: sprite }),
    ).toBeVisible();
  }

  await openPackedSpritesList(page);

  await expect(customBinsInPackedListLocator(page)).toHaveCount(
    customBinNames.length + 1,
  );
  for (const binName of customBinNames) {
    await expect(
      customBinsInPackedListLocator(page).filter({ hasText: binName }),
    ).toBeVisible();
  }
  const firstBinId = await getCustomBinId(page, customBinNames[0]);
  await expect(
    spritesInSpecificBinLocator(page, { binId: firstBinId }),
  ).toHaveCount(spritesInBin1.length);

  for (const sprite of spritesInBin1) {
    await expect(
      spritesInPackedListLocator(page).filter({ hasText: sprite }),
    ).toBeVisible();
  }
});
