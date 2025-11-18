import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

type tPhaserFrame = {
  filename: string;
  rotated: boolean;
  trimmed: boolean;
  sourceSize: { w: number; h: number };
  spriteSourceSize: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

export const generatePhaserAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  spritesMap,
  pixelFormat,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas = {
    textures: [
      {
        image: textureAtlasFilename,
        ...(pixelFormat && { format: pixelFormat }),
        size: {
          w: textureWidth,
          h: textureHeight,
        },
        scale: 1,
        frames: packedSprites.reduce((acc, packedSprite) => {
          const sprite = spritesMap[packedSprite.id];
          if (!sprite) return acc;
          const { width, height } = sprite;
          acc.push({
            filename: sprite.name,
            frame: {
              x: packedSprite.x,
              y: packedSprite.y,
              w: width,
              h: height,
            },
            sourceSize: { w: width, h: height },
            spriteSourceSize: { x: 0, y: 0, w: width, h: height },
            trimmed: false,
            rotated: Boolean(packedSprite.rotated),
          });
          return acc;
        }, [] as tPhaserFrame[]),
      },
    ],
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
