import type { Page } from "@playwright/test";
import {
  outputFrameworkLocator,
  outputTextureFormatLocator,
  outputTextureFileNameLocator,
  outputImageQualityLocator,
  outputDataFileNameLocator,
} from "../locators/output-settings";
import type { tOutputFramework } from "../../src/config";

export const changeOutputTextureFormat = async (page: Page, value: string) => {
  const label = outputTextureFormatLocator(page);
  await label.selectOption(value);
};
export const changeOutputTextureFileName = async (
  page: Page,
  value: string,
) => {
  const label = outputTextureFileNameLocator(page);
  await label.fill(value);
  await label.press("Enter");
};
export const changeOutputDataFileName = async (page: Page, value: string) => {
  const label = outputDataFileNameLocator(page);
  await label.fill(value);
  await label.press("Enter");
};
export const changeOutputImageQuality = async (page: Page, value: string) => {
  const label = outputImageQualityLocator(page);
  await label.fill(value);
  await label.press("Enter");
};

export const changeOutputFramework = async (
  page: Page,
  value: tOutputFramework,
) => {
  const label = outputFrameworkLocator(page);
  await label.selectOption(value);
};
