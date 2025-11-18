import { generatePixiAtlasFile } from "./pixi";
import { generatePhaserAtlasFile } from "./phaser";
import { generateGodotAtlasFile } from "./godot";
import { generateCssAtlasFile } from "./css";
import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";
import type { tOutputFramework } from "#config";

export const generateAtlasFile = (
  data: tGenerateAtlasFileArgs & { framework: tOutputFramework },
): tGenerateAtlasFileOutput => {
  switch (data.framework) {
    case "pixi":
      return generatePixiAtlasFile(data);
    case "phaser":
      return generatePhaserAtlasFile(data);
    case "godot":
      return generateGodotAtlasFile(data);
    case "css":
      return generateCssAtlasFile(data);
    default:
      return generatePixiAtlasFile(data);
  }
};
