import type { Page } from "@playwright/test";
import type { tOutputFramework } from "../../src/config";
import { isDefined } from "../utils/is-defined";
import {
  changeOutputDataFileName,
  changeOutputFramework,
  changeOutputImageQuality,
  changeOutputTextureFileName,
  changeOutputTextureFormat,
} from "../fixtures/change-output-settings";

export const updateOutputSettingsWorkflow = async (
  page: Page,
  {
    textureFormat,
    textureFileName,
    dataFileName,
    imageQuality,
    framework,
  }: {
    textureFormat?: string;
    textureFileName?: string;
    dataFileName?: string;
    imageQuality?: string;
    framework?: tOutputFramework;
  },
) => {
  if (isDefined(textureFormat)) {
    await changeOutputTextureFormat(page, textureFormat);
  }
  if (isDefined(textureFileName)) {
    await changeOutputTextureFileName(page, textureFileName);
  }
  if (isDefined(imageQuality)) {
    await changeOutputImageQuality(page, imageQuality);
  }
  if (isDefined(dataFileName)) {
    await changeOutputDataFileName(page, dataFileName);
  }
  if (isDefined(framework)) {
    await changeOutputFramework(page, framework);
  }
};
