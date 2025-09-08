import { downloadFile } from "#utils/download-file";
import jsZip from "jszip";
import { asyncReduce } from "#utils/async-reduce";
import { generateAtlasFile } from "@/atlas/generate-atlas-file";
import { convertBinToBlob } from "@/canvas/convert-bin-to-blob";
import type { tPackedBin } from "@/packer/types";

type tOptions = {
  framework: string;
  imageQuality: number;
  textureFormat: string;
  pngCompression: number;
  dataFileName: string;
  textureFileName: string;
  packedSprites: tPackedBin[];
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
      const atlasFile = generateAtlasFile({
        sprites: packedBin.sprites,
        textureWidth: packedBin.width,
        textureHeight: packedBin.height,
        textureAtlasFilename: imageFilename,
        framework: opts.framework,
      });
      archive.file(imageFilename, textureAtlas);
      archive.file(`${opts.dataFileName}${filePostfix}.json`, atlasFile);
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
