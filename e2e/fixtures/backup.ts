import type { Page } from "@playwright/test";
import { openAppMenu } from "./open-app-menu";
import { t } from "../utils/t";
import path from "node:path";

export const DOWNLOAD_FOLDER = path.join(
  import.meta.dirname,
  "..",
  "downloads",
);

export const downloadBackup = async (
  page: Page,
): Promise<{ backupPath: string }> => {
  const menuLoc = await openAppMenu(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    menuLoc.getByText(t("backup.create_backup")).click(),
  ]);
  const savePath = path.join(DOWNLOAD_FOLDER, download.suggestedFilename());
  await download.saveAs(savePath);
  return { backupPath: savePath };
};
export const restoreFromBackup = async (
  page: Page,
  { backupPath }: { backupPath: string },
) => {
  const menuLoc = await openAppMenu(page);
  await menuLoc.getByText(t("backup.restore_from_backup")).click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    await menuLoc.getByText(t("backup.restore_from_backup")).click(),
  ]);
  const confirmBtnLoc = page
    .getByRole("dialog")
    .getByText(t("confirm_dialog.default_yes"), { exact: true });
  await fileChooser.setFiles(backupPath);
  await confirmBtnLoc.click();

  await page
    .getByText(t("backup.restore_success"))
    .waitFor({ state: "visible" });
};
