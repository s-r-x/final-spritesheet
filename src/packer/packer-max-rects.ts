import { MaxRectsPacker, Rectangle } from "maxrects-packer";
import type { tSprite } from "@/input/types";
import type { tPackedBin } from "./types";
import { isEmpty } from "#utils/is-empty";

type tOptions = {
  sprites: tSprite[];
  size: number;
  padding: number;
  edgeSpacing: number;
  pot: boolean;
  allowRotation: boolean;
};
type tReturnValue = {
  bins: tPackedBin[];
  oversizedSprites: tSprite[];
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
}: tOptions): tReturnValue {
  if (isEmpty(sprites)) return defaultReturnValue;
  const { oversized: oversizedSprites, ok: okSprites } = sprites.reduce(
    (acc, sprite) => {
      if (
        sprite.width + edgeSpacing > size ||
        sprite.height + edgeSpacing > size
      ) {
        acc.oversized.push(sprite);
      } else {
        acc.ok.push(sprite);
      }
      return acc;
    },
    { oversized: [] as tSprite[], ok: [] as tSprite[] },
  );
  const packer = new MaxRectsPacker(size, size, padding, {
    border: edgeSpacing,
    pot,
    allowRotation,
  });
  packer.addArray(
    okSprites.map((s) => {
      const rect = new Rectangle(s.width, s.height);
      rect.data = { sprite: s };
      return rect;
    }),
  );
  const bins: tPackedBin[] = packer.bins.map((bin) => ({
    maxWidth: bin.maxWidth,
    maxHeight: bin.maxHeight,
    width: bin.width,
    height: bin.height,
    sprites: bin.rects.map((rect) => ({
      ...(rect.data.sprite as tSprite),
      x: rect.x,
      y: rect.y,
      rotated: rect.rot,
      oversized: rect.oversized,
    })),
  }));
  return {
    bins,
    oversizedSprites,
  };
}
