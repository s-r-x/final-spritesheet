import { expect, type Page } from "@playwright/test";
import {
  outputDataFileNameLocator,
  outputFrameworkLocator,
  outputImageQualityLocator,
  outputTextureFileNameLocator,
  outputTextureFormatLocator,
} from "../locators/output-settings";
import type { tOutputFramework } from "../../src/config";

export const assertOutputTextureFormatValue = async (
  page: Page,
  value: string,
) => {
  await expect(outputTextureFormatLocator(page)).toHaveValue(value);
};
export const assertOutputTextureFileNameValue = async (
  page: Page,
  value: string,
) => {
  await expect(outputTextureFileNameLocator(page)).toHaveValue(value);
};

export const assertOutputDataFileNameValue = async (
  page: Page,
  value: string,
) => {
  await expect(outputDataFileNameLocator(page)).toHaveValue(value);
};

export const assertOutputImageQualityValue = async (
  page: Page,
  value: string,
) => {
  await expect(outputImageQualityLocator(page)).toHaveValue(value);
};

export const assertOutputFrameworkValue = async (
  page: Page,
  value: tOutputFramework,
) => {
  await expect(outputFrameworkLocator(page)).toHaveValue(value);
};
