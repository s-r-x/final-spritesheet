import { generatePixiAtlasFile } from "./pixi";
import { generatePhaserAtlasFile } from "./phaser";
import { generateGodotAtlasFile } from "./godot";
import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateAtlasFile = (
  data: tGenerateAtlasFileArgs & { framework: string },
): tGenerateAtlasFileOutput => {
  switch (data.framework) {
    case "pixi":
      return generatePixiAtlasFile(data);
    case "phaser":
      return generatePhaserAtlasFile(data);
    case "godot":
      return generateGodotAtlasFile(data);
    default:
      return generatePixiAtlasFile(data);
  }
};
