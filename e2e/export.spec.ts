import test, { expect } from "@playwright/test";
import { navigateTo } from "./fixtures/navigate-to";
import { openPackedSpritesList } from "./fixtures/open-packed-sprites-list";
import { uploadSprites } from "./fixtures/upload-sprites";
import { exportResult } from "./fixtures/export";
import { updatePackerSettingsWorkflow } from "./workflows/update-packer-settings";
import { updateOutputSettingsWorkflow } from "./workflows/update-output-settings";
import { compareImages } from "./utils/compare-images";
import path from "node:path";
import { normalizeTestTextureName } from "./utils/normalize-test-texture-name";
import fs from "node:fs/promises";

// there are some artifacts in webkit with jpeg and webp
const imgCmprWebkitThreshold = 0.2;
const imgCmprNormalBrowserThreshold = 0.0;
test.beforeEach(async ({ page }) => {
  await navigateTo(page);
});
test("should generate correct texture and atlas files (1)", async ({
  page,
  browserName,
}) => {
  await openPackedSpritesList(page);
  const sprites = [
    "512x512-blue.webp",
    "256x256-green.webp",
    "16x16-red.webp",
    "64x64-black.webp",
    "32x32-yellow.webp",
  ];
  await updatePackerSettingsWorkflow(page, {
    sheetSize: 1024,
    multipack: "auto",
    algorithm: "basic",
    pot: false,
    allowRotation: false,
    spritePadding: 2,
    edgeSpacing: 5,
  });
  const textureFileName = "txt";
  const textureFormat = "webp";
  const dataFileName = "pixi-data";
  await updateOutputSettingsWorkflow(page, {
    framework: "pixi",
    textureFormat,
    imageQuality: "80",
    textureFileName,
    dataFileName,
  });
  await uploadSprites(page, { sprites });
  const { folderPath } = await exportResult(page, { extract: true });

  const { match } = await compareImages(
    path.join(folderPath, textureFileName + "." + textureFormat),
    normalizeTestTextureName("1.webp"),
    {
      threshold:
        browserName === "webkit"
          ? imgCmprWebkitThreshold
          : imgCmprNormalBrowserThreshold,
    },
  );
  expect(match, "texture should match").toBeTruthy();
  const dataFile = await fs.readFile(
    path.join(folderPath, dataFileName + ".json"),
    "utf-8",
  );
  expect(typeof JSON.parse(dataFile), "data file should exist").toEqual(
    "object",
  );
});
test("should generate correct texture and atlas files (2)", async ({
  page,
}) => {
  await openPackedSpritesList(page);
  const sprites = ["2020x2048-red.jpeg", "28x2048-green.png"];
  await updatePackerSettingsWorkflow(page, {
    sheetSize: 2048,
    multipack: "off",
    algorithm: "maxRects",
    pot: false,
    allowRotation: true,
    spritePadding: 0,
    edgeSpacing: 0,
  });
  const textureFileName = "txt";
  const textureFormat = "png";
  const dataFileName = "phaser-data";
  await updateOutputSettingsWorkflow(page, {
    framework: "phaser",
    textureFormat,
    textureFileName,
    dataFileName,
  });
  await uploadSprites(page, { sprites });
  const { folderPath } = await exportResult(page, { extract: true });

  const { match } = await compareImages(
    path.join(folderPath, textureFileName + "." + textureFormat),
    normalizeTestTextureName("2.png"),
  );
  expect(match, "texture should match").toBeTruthy();

  const dataFile = await fs.readFile(
    path.join(folderPath, dataFileName + ".json"),
    "utf-8",
  );
  expect(typeof JSON.parse(dataFile), "data file should exist").toEqual(
    "object",
  );
});
test("should generate correct texture and atlas files (3)", async ({
  page,
  browserName,
}) => {
  await openPackedSpritesList(page);
  const sprites = [
    "64x64-red.webp",
    "64x64-magenta.webp",
    "64x64-black.webp",
    "64x64-brown.webp",
  ];
  await updatePackerSettingsWorkflow(page, {
    sheetSize: 128,
    multipack: "off",
    algorithm: "grid",
    pot: true,
    spritePadding: 0,
    edgeSpacing: 0,
  });
  const textureFileName = "txt";
  const textureFormat = "jpeg";
  const dataFileName = "css-data";
  await updateOutputSettingsWorkflow(page, {
    framework: "css",
    textureFormat,
    textureFileName,
    imageQuality: "100",
    dataFileName,
  });
  await uploadSprites(page, { sprites });
  const { folderPath } = await exportResult(page, { extract: true });

  const { match } = await compareImages(
    path.join(folderPath, textureFileName + "." + textureFormat),
    normalizeTestTextureName("3.jpeg"),

    {
      threshold:
        browserName === "webkit"
          ? imgCmprWebkitThreshold
          : imgCmprNormalBrowserThreshold,
    },
  );
  expect(match, "texture should match").toBeTruthy();
  const dataFile = await fs.readFile(
    path.join(folderPath, dataFileName + ".css"),
    "utf-8",
  );
  expect(dataFile.length, "data file should exist").toBeGreaterThan(0);
});
