import { invariant } from "#utils/invariant";
import { isEmpty } from "#utils/is-empty";
import { maxBy } from "#utils/max-by";
import type {
  tPackedBin,
  tPackedSprite,
  tPacker,
  tPackerReturnValue,
  tPackerSpriteExcerpt,
} from "./types";

const MAX_ITERATIONS = 1000;
const MAX_ITERATIONS_ERR_MESSAGE = "Too many iterations in grid packer";

const defaultReturnValue: tPackerReturnValue = {
  oversizedSprites: [],
  bins: [],
};
export const gridPacker: tPacker = {
  pack({ size, sprites, padding = 0, edgeSpacing = 0, forceSingleBin }) {
    if (isEmpty(sprites)) return defaultReturnValue;

    const doubleEdgeSpacing = edgeSpacing * 2;
    const cellWidth = maxBy(sprites, (sprite) => sprite.width)?.width;
    const cellHeight = maxBy(sprites, (sprite) => sprite.height)?.height;

    if (!cellWidth || !cellHeight) return defaultReturnValue;
    const isTooWide = cellWidth + doubleEdgeSpacing > size;
    const isTooTall = cellHeight + doubleEdgeSpacing > size;
    if (isTooWide || isTooTall) {
      return {
        oversizedSprites: sprites.map((sprite) => sprite.id),
        bins: [],
      };
    }

    const packBin = (
      spritesInput: tPackerSpriteExcerpt[],
    ): Maybe<tPackedBin> => {
      const numberOfCols = Math.floor(
        (size + padding - doubleEdgeSpacing) / (cellWidth + padding),
      );
      const binWidth =
        doubleEdgeSpacing +
        numberOfCols * cellWidth +
        (padding ? padding * (numberOfCols - 1) : 0);
      let i = 0;
      let binHeight = 0;
      const packedSprites: tPackedSprite[] = [];
      while (spritesInput.length) {
        invariant(i < MAX_ITERATIONS, MAX_ITERATIONS_ERR_MESSAGE);
        const row = Math.floor(i / numberOfCols);
        const col = i % numberOfCols;
        const x = edgeSpacing + col * (cellWidth + padding);
        const y = edgeSpacing + row * (cellHeight + padding);
        const newBinHeight = y + cellHeight + edgeSpacing;
        if (newBinHeight > size) {
          break;
        } else {
          binHeight = newBinHeight;
          const spriteToPack = spritesInput.shift();
          if (spriteToPack) {
            packedSprites.push({ id: spriteToPack.id, x, y });
            i++;
          } else {
            break;
          }
        }
      }
      if (isEmpty(packedSprites)) return null;
      return {
        maxWidth: size,
        maxHeight: size,
        width: binWidth,
        height: binHeight,
        sprites: packedSprites,
      };
    };

    const bins: tPackedBin[] = [];
    const spritesToPack = [...sprites];
    let i = 0;
    const oversizedSprites: string[] = [];
    while (spritesToPack.length) {
      invariant(i++ < MAX_ITERATIONS, MAX_ITERATIONS_ERR_MESSAGE);
      const bin = packBin(spritesToPack);
      if (bin) {
        bins.push(bin);
      } else {
        break;
      }
      if (forceSingleBin) {
        oversizedSprites.push(...spritesToPack.map((sprite) => sprite.id));
        break;
      }
    }
    return {
      oversizedSprites: oversizedSprites,
      bins,
    };
  },
};
