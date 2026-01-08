import { compare } from "odiff-bin";
import os from "node:os";
import path from "node:path";
import { nanoid } from "nanoid";

export async function compareImages(
  srcPath: string,
  dstPath: string,
  {
    threshold = 0,
    printDiffPath,
  }: {
    threshold?: number;
    printDiffPath?: boolean;
  } = {},
): Promise<{ match: boolean }> {
  const diffPath = path.join(os.tmpdir(), nanoid() + ".png");
  if (printDiffPath) {
    console.log(diffPath);
  }
  const { match } = await compare(srcPath, dstPath, diffPath, {
    threshold,
    //diffOverlay: true,
  });
  return { match };
}
