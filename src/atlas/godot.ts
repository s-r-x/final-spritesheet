import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateGodotAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  sprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const atlas = {
    textures: [
      {
        image: textureAtlasFilename,
        size: {
          w: textureWidth,
          h: textureHeight,
        },
        sprites: sprites.map((sprite) => ({
          filename: sprite.name,
          region: {
            x: sprite.x,
            y: sprite.y,
            w: sprite.width,
            h: sprite.height,
          },
          margin: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
          },
        })),
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
