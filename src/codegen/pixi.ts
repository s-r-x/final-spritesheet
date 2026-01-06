import type { tPixiAtlas } from "@/atlas/types";
import { isEmpty } from "#utils/is-empty";

export const generatePixiTSCode = ({
  atlas,
  atlasFileName,
}: {
  atlas: Pick<tPixiAtlas, "animations"> & { frames: Record<string, any> };
  atlasFileName: string;
}) => {
  const spritesheetTypeName = "FinalSpritesheet";
  const texturesMapTypeName = "TexturesMap";
  const animationsMapTypeName = "AnimationsMap";

  const code = `import { Assets, type Texture, type Spritesheet } from "pixi.js";

export type ${texturesMapTypeName} = {
${Object.keys(atlas.frames)
  .map((name) => {
    return `  "${name}": Texture`;
  })
  .join(",\n")};
}
export type ${animationsMapTypeName} = ${
    isEmpty(atlas.animations)
      ? "Record<string, never>"
      : `{
${Object.keys(atlas.animations!)
  .map((name) => {
    return `  "${name}": Texture[]`;
  })
  .join(",\n")};
}`
  };

export type ${spritesheetTypeName} = Spritesheet & {
  textures: ${texturesMapTypeName};
  animations: ${animationsMapTypeName};
};

export async function loadSpritesheet(basePath: string = "/"): Promise<FinalSpritesheet> {
  const url = (basePath.endsWith("/") ? basePath : basePath + "/") + "${atlasFileName}";
  const sheet = await Assets.load<${spritesheetTypeName}>(url);
  return sheet;
};
`;
  return { code };
};
