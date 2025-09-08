import { generatePixiAtlasFile } from "./generate-pixi-atlas-file";
import { generatePhaserAtlasFile } from "./generate-phaser-atlas-file";
import type { tGenerateAtlasFileArgs } from "./types";

export const generateAtlasFile = ({
  sprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  framework,
}: tGenerateAtlasFileArgs & { framework: string }): string => {
  switch (framework) {
    case "pixi":
      return generatePixiAtlasFile({
        sprites,
        textureWidth,
        textureHeight,
        textureAtlasFilename,
      });
    case "phaser":
      return generatePhaserAtlasFile({
        sprites,
        textureWidth,
        textureHeight,
        textureAtlasFilename,
      });
  }
  throw new Error("unknown framework");
};
