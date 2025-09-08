import type { tGenerateAtlasFileArgs } from "./types";

export const generatePhaserAtlasFile = ({
  sprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
}: tGenerateAtlasFileArgs): string => {
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
  return JSON.stringify(atlas, null, 2);
};
