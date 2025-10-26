import { invariant } from "#utils/invariant";
import { isEmpty } from "#utils/is-empty";
import { sortBy } from "#utils/sort-by";
import type {
  tPackedBin,
  tPackedSprite,
  tPacker,
  tPackerReturnValue,
  tPackerSpriteExcerpt,
} from "./types";

const MAX_ITERATIONS = 1000;
const MAX_ITERATIONS_ERR_MESSAGE = "Too many iterations in basic packer";

const defaultReturnValue: tPackerReturnValue = {
  oversizedSprites: [],
  bins: [],
};
export const basicPacker: tPacker = {
  pack({
    size,
    sprites: baseSprites,
    padding = 0,
    edgeSpacing = 0,
    forceSingleBin,
  }) {
    if (isEmpty(baseSprites)) return defaultReturnValue;
    const sortedSprites = sortBy(
      baseSprites,
      (sprite) => sprite.height,
      "desc",
    );

    const doubleEdgeSpacing = edgeSpacing * 2;
    const { oversized: oversizedSprites, ok: sprites } = sortedSprites.reduce(
      (acc, sprite) => {
        if (
          sprite.width + edgeSpacing * 2 > size ||
          sprite.height + edgeSpacing * 2 > size
        ) {
          acc.oversized.push(sprite.id);
        } else {
          acc.ok.push(sprite);
        }
        return acc;
      },
      {
        oversized: [] as string[],
        ok: [] as tPackerSpriteExcerpt[],
      },
    );

    const packBin = (
      spritesInput: tPackerSpriteExcerpt[],
      binIndex: number,
    ): Maybe<tPackedBin> => {
      let i = 0;
      let binWidth = 0;
      let binHeight = 0;
      // this is the width of all the sprites in the current shelf
      // specifically without any paddings and edge spacings
      let shelfWidth = 0;
      let shelfY = 0;
      let shelfHeight = 0;
      // the only use case for these ones is to calculate the padding for the current row/col.
      // padding is calculated with this formula: (number of items in a row/col - 1) * padding
      let col = 0;
      let row = 0;
      const packedSprites: tPackedSprite[] = [];
      while (spritesInput.length) {
        invariant(i++ < MAX_ITERATIONS, MAX_ITERATIONS_ERR_MESSAGE);

        const sprite = spritesInput[0];
        if (!sprite) break;
        let x = edgeSpacing + col * padding + shelfWidth;
        let maybeNewBinWidth = x + sprite.width + edgeSpacing;
        // too wide. starting a new row
        if (maybeNewBinWidth > size) {
          shelfWidth = 0;
          shelfY += shelfHeight;
          x = edgeSpacing;
          shelfHeight = 0;
          col = 0;
          row++;
          maybeNewBinWidth = doubleEdgeSpacing + sprite.width;
        }
        const y = edgeSpacing + row * padding + shelfY;
        const maybeNewBinHeight = y + sprite.height + edgeSpacing;
        // too tall. the bin is full
        if (maybeNewBinHeight > size) {
          break;
        }
        shelfWidth += sprite.width;
        binWidth = Math.max(maybeNewBinWidth, binWidth);
        binHeight = Math.max(maybeNewBinHeight, binHeight);
        shelfHeight = Math.max(shelfHeight, sprite.height);
        col++;
        packedSprites.push({
          id: sprite.id,
          x,
          y,
        });
        spritesInput.shift();
      }
      if (isEmpty(packedSprites)) return null;
      return {
        id: String(binIndex),
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
    while (spritesToPack.length) {
      invariant(i < MAX_ITERATIONS, MAX_ITERATIONS_ERR_MESSAGE);
      const bin = packBin(spritesToPack, i);
      if (bin) {
        bins.push(bin);
      } else {
        break;
      }
      if (forceSingleBin) {
        oversizedSprites.push(...spritesToPack.map((sprite) => sprite.id));

        break;
      }
      i++;
    }
    return {
      oversizedSprites: oversizedSprites,
      bins,
    };
  },
};
