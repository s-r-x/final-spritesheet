import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateGodotAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  spritesMap,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas = {
    textures: [
      {
        image: textureAtlasFilename,
        size: {
          w: textureWidth,
          h: textureHeight,
        },
        sprites: packedSprites.map((packedSprite) => {
          const sprite = spritesMap[packedSprite.id];
          return {
            filename: sprite.name,
            region: {
              x: packedSprite.x,
              y: packedSprite.y,
              w: sprite.width,
              h: sprite.height,
            },
            margin: {
              x: 0,
              y: 0,
              w: 0,
              h: 0,
            },
          };
        }),
      },
    ],
    meta: {},
  };
  return {
    entries: [
      {
        fileName: `${baseFileName}${fileNamePostfix}.tpsheet`,
        content: JSON.stringify(atlas, null, 2),
      },
    ],
  };
};
