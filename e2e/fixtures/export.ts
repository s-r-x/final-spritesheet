import type { Page } from "@playwright/test";
import { exportButtonLocator } from "../locators/export-button";
import unzipper from "unzipper";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";

export function exportResult(page: Page): Promise<{ archivePath: string }>;
export function exportResult(
  page: Page,
  args: { extract: true },
): Promise<{ folderPath: string }>;
export async function exportResult(page: Page, args?: { extract: true }) {
  const loc = exportButtonLocator(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    loc.click(),
  ]);
  const savePath = path.join(os.tmpdir(), download.suggestedFilename());
  await download.saveAs(savePath);
  if (!args?.extract) {
    return { archivePath: savePath };
  } else {
    const archiveDir = await unzipper.Open.file(savePath);
    const tempDirName = path.join(os.tmpdir(), nanoid());
    await fs.mkdir(tempDirName);
    await archiveDir.extract({ path: tempDirName });
    return { folderPath: tempDirName };
  }
}
