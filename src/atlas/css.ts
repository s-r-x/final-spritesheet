import { stripFileExtension } from "#utils/strip-file-extension";
import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateCssAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  spritesMap,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const parts: string[] = [
    `
/* -----------------------------------------------------
 <span class="name sprite"></span>
*/

.sprite {display:inline-block;overflow:hidden;background-repeat:no-repeat;background-image:url(texture.png);}
`,
  ];
  for (const packedSprite of packedSprites) {
    const sprite = spritesMap[packedSprite.id];
    if (!sprite) continue;
    const className = toCssClassName(sprite.name);
    if (!className) continue;
    const { width, height } = sprite;
    const { x, y } = packedSprite;
    parts.push(
      `.${className} {width:${width}px;height:${height}px;background-position:${-x || 0}px ${-y || 0}px;}`,
    );
  }
  return {
    entries: [
      {
        fileName: `${baseFileName}${fileNamePostfix}.css`,
        content: parts.join("\n"),
      },
    ],
  };
};

function toCssClassName(inputString: string): string {
  if (!inputString) {
    return "";
  }
  const className = stripFileExtension(inputString)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return className;
}
