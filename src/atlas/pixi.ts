import { generatePixiTSCode } from "@/codegen/pixi";
import type {
  tGenerateAtlasFileArgs,
  tGenerateAtlasFileOutput,
  tGenerateAtlasFileResultEntry,
  tPixiAtlas,
} from "./types";

export const generatePixiAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  spritesMap,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  animations,
  pixelFormat,
  pixiGenTs,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas: tPixiAtlas = {
    frames: packedSprites.reduce(
      (acc, packedSprite) => {
        const sprite = spritesMap[packedSprite.id];
        if (!sprite) return acc;
        const { width, height } = sprite;
        acc[sprite.name] = {
          frame: {
            x: packedSprite.x,
            y: packedSprite.y,
            w: width,
            h: height,
          },
          sourceSize: { w: width, h: height },
          spriteSourceSize: { x: 0, y: 0, w: width, h: height },
          trimmed: false,
          rotated: packedSprite.rotated,
        };
        return acc;
      },
      {} as tPixiAtlas["frames"],
    ),
    animations,
    meta: {
      format: pixelFormat,
      scale: "1",
      image: textureAtlasFilename,
      size: {
        w: textureWidth,
        h: textureHeight,
      },
    },
  };

  const finalBaseFileName = baseFileName + fileNamePostfix;
  const fileName = finalBaseFileName + ".json";
  const entries: tGenerateAtlasFileResultEntry[] = [
    {
      fileName,
      content: JSON.stringify(atlas, null, 2),
    },
  ];
  if (pixiGenTs) {
    const { code: content } = generatePixiTSCode({
      atlas,
      atlasFileName: fileName,
    });
    entries.push({
      fileName: finalBaseFileName + ".ts",
      content,
    });
  }

  return {
    entries,
  };
};
