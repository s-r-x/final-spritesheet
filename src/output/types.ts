import type { tOutputFramework } from "#config";
export type { tOutputFramework };
export type tOutputSettings = {
  framework: tOutputFramework;
  pngCompression: number;
  imageQuality: number;
  textureFormat: string;
  dataFileName: string;
  textureFileName: string;
};
