import { MaxRectsPacker, Rectangle } from "maxrects-packer";
import type {
  tPackerSpriteExcerpt,
  tPackedBin,
  tPackedSprite,
  tPackerReturnValue,
  tPacker,
} from "./types";
import { isEmpty } from "#utils/is-empty";

const defaultReturnValue: tPackerReturnValue = {
  bins: [],
  oversizedSprites: [],
};

export const maxRectsPacker: tPacker = {
  pack({
    sprites,
    size,
    padding = 0,
    edgeSpacing = 0,
    pot,
    allowRotation,
    tags,
  }) {
    if (isEmpty(sprites)) return defaultReturnValue;
    const { oversized: oversizedSprites, ok: okSprites } = sprites.reduce(
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
    const packer = new MaxRectsPacker(size, size, padding, {
      border: edgeSpacing,
      pot,
      allowRotation,
      tag: true,
      exclusiveTag: true,
    });
    packer.addArray(
      okSprites.map((s) => {
        const rect = new Rectangle(s.width, s.height);
        rect.data = { sprite: s, tag: tags?.[s.id] };
        return rect;
      }),
    );
    const bins: tPackedBin[] = packer.bins.map((bin) => {
      return {
        maxWidth: bin.maxWidth,
        maxHeight: bin.maxHeight,
        width: bin.width,
        height: bin.height,
        tag: bin.tag,
        sprites: bin.rects.map((rect) => {
          const packedSprite: tPackedSprite = {
            id: (rect.data.sprite as tPackerSpriteExcerpt).id,
            x: rect.x,
            y: rect.y,
            rotated: rect.rot,
            oversized: rect.oversized,
          };
          return packedSprite;
        }),
      };
    });
    return {
      bins,
      oversizedSprites,
    };
  },
};
