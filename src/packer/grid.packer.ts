import { isEmpty } from "#utils/is-empty";
import { maxBy } from "#utils/max-by";
import type {
  tPackedBin,
  tPackedSprite,
  tPacker,
  tPackerReturnValue,
} from "./types";

const defaultReturnValue: tPackerReturnValue = {
  oversizedSprites: [],
  bins: [],
};
export const gridPacker: tPacker = {
  pack({ size, sprites, padding = 0, edgeSpacing = 0 }) {
    if (isEmpty(sprites)) return defaultReturnValue;

    const doubleEdgeSpacing = edgeSpacing * 2;
    const cellWidth = maxBy(sprites, (sprite) => sprite.width)?.width;
    const cellHeight = maxBy(sprites, (sprite) => sprite.height)?.height;

    if (!cellWidth || !cellHeight) return defaultReturnValue;
    const isTooWide = cellWidth + doubleEdgeSpacing > size;
    const isTooHigh = cellHeight + doubleEdgeSpacing > size;
    if (isTooWide || isTooHigh) {
      return {
        oversizedSprites: sprites.map((sprite) => sprite.id),
        bins: [],
      };
    }

    const numberOfCols = Math.floor(
      (size + padding - doubleEdgeSpacing) / (cellWidth + padding),
    );
    let packedSprites: tPackedSprite[] = [];
    const bins: tPackedBin[] = [];
    let i = 0;
    const binWidth =
      doubleEdgeSpacing +
      numberOfCols * cellWidth +
      (padding ? padding * (numberOfCols - 1) : 0);
    let binHeight = 0;

    for (const sprite of sprites) {
      const row = Math.floor(i / numberOfCols);
      const col = i % numberOfCols;
      const x = edgeSpacing + col * (cellWidth + padding);
      const y = edgeSpacing + row * (cellHeight + padding);
      const newBinHeight = y + cellHeight + edgeSpacing;
      if (newBinHeight > size) {
        // the current bin is packed
        bins.push({
          width: binWidth,
          maxWidth: size,
          maxHeight: size,
          height: binHeight,
          sprites: packedSprites,
        });
        // starting a new one
        packedSprites = [
          {
            x: edgeSpacing,
            y: edgeSpacing,
            id: sprite.id,
          },
        ];
        // assume that's the last packed sprite in the bin
        // if it's not the height will be overriden on the next iteration
        binHeight = cellHeight + doubleEdgeSpacing;
        i = 1;
      } else {
        binHeight = newBinHeight;
        packedSprites.push({ id: sprite.id, x, y });
        i++;
      }
    }

    if (!isEmpty(packedSprites)) {
      bins.push({
        width: binWidth,
        maxWidth: size,
        maxHeight: size,
        height: binHeight,
        sprites: packedSprites,
      });
    }
    return {
      oversizedSprites: [],
      bins,
    };
  },
};
