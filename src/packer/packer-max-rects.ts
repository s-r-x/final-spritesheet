import { MaxRectsPacker, Rectangle } from "maxrects-packer";
import type { tPackerSpriteExcerpt, tPackedBin, tPackedSprite } from "./types";
import { isEmpty } from "#utils/is-empty";

type tOptions = {
  sprites: tPackerSpriteExcerpt[];
  size: number;
  padding: number;
  edgeSpacing: number;
  pot: boolean;
  allowRotation: boolean;
  tags?: Record<string, string>;
};
type tReturnValue = {
  bins: tPackedBin[];
  oversizedSprites: string[];
};

const defaultReturnValue: tReturnValue = {
  bins: [],
  oversizedSprites: [],
};
export function packMaxRects({
  sprites,
  size,
  padding,
  edgeSpacing,
  pot,
  allowRotation,
  tags,
}: tOptions): tReturnValue {
  if (isEmpty(sprites)) return defaultReturnValue;
  const { oversized: oversizedSprites, ok: okSprites } = sprites.reduce(
    (acc, sprite) => {
      if (
        sprite.width + edgeSpacing > size ||
        sprite.height + edgeSpacing > size
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
}
