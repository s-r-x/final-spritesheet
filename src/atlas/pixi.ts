import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generatePixiAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  spritesMap,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  animations,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas = {
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
      {} as Record<string, any>,
    ),
    animations,
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
