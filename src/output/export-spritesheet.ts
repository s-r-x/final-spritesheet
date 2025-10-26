import { downloadFile } from "#utils/download-file";
import jsZip from "jszip";
import { asyncReduce } from "#utils/async-reduce";
import { generateAtlasFile } from "@/atlas/generate-atlas-file";
import { convertBinToBlob } from "@/canvas/convert-bin-to-blob";
import type { tPackedBin } from "@/packer/types";
import type { tSpritesMap } from "@/input/types";

// { binId: { myAnimation: ["1.png", "2.png"] } }
export type tAnimationsMap = Record<string, Record<string, string[]>>;

type tOptions = {
  framework: string;
  imageQuality: number;
  textureFormat: string;
  pngCompression: number;
  dataFileName: string;
  textureFileName: string;
  packedSprites: tPackedBin[];
  spritesMap: tSpritesMap;
  animations?: tAnimationsMap;
  archiveName?: string;
};

export const exportSpritesheet = async (opts: tOptions) => {
  const imageMime = mapImageFormatToMime(opts.textureFormat);

  const bins = opts.packedSprites;
  const isMultipleBins = bins.length > 1;
  const archive = await asyncReduce(
    bins,
    async (archive, packedBin, idx) => {
      const textureAtlas = await convertBinToBlob({
        mimeType: imageMime,
        quality: opts.imageQuality,
        binIndex: idx,
        pngCompression: opts.pngCompression,
      });
      if (!textureAtlas) return archive;
      const filePostfix = isMultipleBins ? `-${idx}` : "";
      const imageFilename = `${opts.textureFileName}${filePostfix}.${opts.textureFormat}`;
      const { entries: atlasFileEntries } = generateAtlasFile({
        baseFileName: opts.dataFileName,
        spritesMap: opts.spritesMap,
        fileNamePostfix: filePostfix,
        packedSprites: packedBin.sprites,
        textureWidth: packedBin.width,
        textureHeight: packedBin.height,
        textureAtlasFilename: imageFilename,
        framework: opts.framework,
        animations: opts.animations?.[packedBin.id],
      });
      for (const entry of atlasFileEntries) {
        archive.file(entry.fileName, entry.content);
      }
      archive.file(imageFilename, textureAtlas);
      return archive;
    },
    new jsZip(),
  );
  downloadFile(
    await archive.generateAsync({ type: "blob" }),
    `${opts.archiveName || "archive"}.zip`,
  );
  //console.log(blob);
  //const url = canvas.toDataURL!("image/png");
  //downloadFile({ data: url, mimeType: "image/png", fileName: "image.png" });
};

const mapImageFormatToMime = (format: string) => {
  switch (format) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
};
