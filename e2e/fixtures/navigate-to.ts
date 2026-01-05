import type { Page } from "@playwright/test";
import { BASE_URL } from "../../vite.config";

export const navigateTo = async (
  page: Page,
  { path = "/" }: { path?: string } = {},
) => {
  const url = BASE_URL + (path.endsWith("/") ? path.slice(0, -1) : path);
  await page.goto(url);
};
