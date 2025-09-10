import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generatePixiAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  sprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas = {
    frames: sprites.reduce(
      (acc, sprite) => {
        const { rotated, width, height } = sprite;
        acc[sprite.name] = {
          frame: {
            x: sprite.x,
            y: sprite.y,
            w: width,
            h: height,
          },
          sourceSize: { w: width, h: height },
          spriteSourceSize: { x: 0, y: 0, w: width, h: height },
          trimmed: false,
          rotated,
        };
        return acc;
      },
      {} as Record<string, any>,
    ),
    meta: {
      scale: "1",
      image: textureAtlasFilename,
      size: {
        w: textureWidth,
        h: textureHeight,
      },
    },
  };
  return {
    entries: [
      {
        fileName: `${baseFileName}${fileNamePostfix}.json`,
        content: JSON.stringify(atlas, null, 2),
      },
    ],
  };
};
