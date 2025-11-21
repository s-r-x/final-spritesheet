import type { tGenerateAtlasFileArgs, tGenerateAtlasFileOutput } from "./types";

export const generateCocosAtlasFile = ({
  baseFileName,
  fileNamePostfix,
  packedSprites,
  textureWidth,
  textureHeight,
  textureAtlasFilename,
  pixelFormat,
  spritesMap,
}: tGenerateAtlasFileArgs): tGenerateAtlasFileOutput => {
  const parts = [
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>frames</key>
<dict>`,
  ];
  for (const packedSprite of packedSprites) {
    const sprite = spritesMap[packedSprite.id];
    if (!sprite) continue;
    const { width, height } = sprite;
    const { x, y } = packedSprite;
    parts.push(`<key>${sprite.name}</key>
<dict>
<key>aliases</key>
<array/>
<key>spriteOffset</key>
<string>{0,0}</string>
<key>spriteSize</key>
<string>{${width},${height}}</string>
<key>spriteSourceSize</key>
<string>{${width},${height}}</string>
<key>textureRect</key>
<string>{{${x},${y}},{${width},${height}}}</string>
<key>textureRotated</key>
<false/>
</dict>`);
  }
  parts.push(`</dict>
<key>metadata</key>
<dict>
<key>format</key>
<integer>3</integer>
<key>pixelFormat</key>
<string>${pixelFormat}</string>
<key>premultiplyAlpha</key>
<false/>
<key>realTextureFileName</key>
<string>${textureAtlasFilename}</string>
<key>size</key>
<string>{${textureWidth},${textureHeight}}</string>
<key>textureFileName</key>
<string>${textureAtlasFilename}</string>
</dict>
</dict>
</plist>`);
  return {
    entries: [
      {
        fileName: `${baseFileName}${fileNamePostfix}.plist`,
        content: parts.join("\n"),
      },
    ],
  };
};
