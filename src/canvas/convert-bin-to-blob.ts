import { canvasRefs } from "./canvas-refs";

export const convertBinToBlob = async ({
  binIndex,
  mimeType,
  pngCompression,
  quality,
}: {
  binIndex: number;
  mimeType: string;
  pngCompression: number;
  quality: number;
}): Promise<Maybe<Blob>> => {
  const canvasApp = canvasRefs.app;
  if (!canvasApp) return null;

  const canvasBin = canvasApp.stage.getChildByLabel(`bin-${binIndex}`, true);
  if (!canvasBin) return null;
  let blob: Blob;
  if (mimeType === "image/png") {
    const pixels = canvasApp.renderer.extract.pixels({
      target: canvasBin,
      resolution: 1,
    });
    const cnum = normalizePngCompression(pngCompression);
    const UPNG = await import("upng-js");
    const norm = UPNG.encode(
      [pixels.pixels.buffer],
      pixels.width,
      pixels.height,
      cnum,
    );
    blob = new Blob([norm], {
      type: "image/png",
    });
  } else {
    const canvas = canvasApp.renderer.extract.canvas({
      target: canvasBin,
      resolution: 1,
    });
    blob = await new Promise((resolve, reject) => {
      canvas.toBlob!(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject();
          }
        },
        mimeType,
        quality / 100,
      );
    });
  }
  return blob;
};

const normalizePngCompression = (compression: number): number => {
  if (compression === 0) return 0;
  return Math.pow(2, 9 - compression);
};
