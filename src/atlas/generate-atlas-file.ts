import { generatePixiAtlasFile } from "./generate-pixi-atlas-file";
import { generatePhaserAtlasFile } from "./generate-phaser-atlas-file";
import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateAtlasFile = (
  data: tGenerateAtlasFileArgs & { framework: string },
): tGenerateAtlasFileOutput => {
  switch (data.framework) {
    case "pixi":
      return generatePixiAtlasFile(data);
    case "phaser":
      return generatePhaserAtlasFile(data);
  }
  throw new Error("unknown framework");
};
