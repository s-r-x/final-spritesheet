import { atom } from "jotai";
import type { tSprite, tUpdateSpriteData } from "./types";
import { isEmpty } from "#utils/is-empty";
import { calcSpriteDimensions } from "./calc-sprite-dimensions";

export const spritesAtom = atom<tSprite[]>([]);

export const hasAnySpritesAtom = atom((get) => !isEmpty(get(spritesAtom)));

const cleanupSprite = (sprite: tSprite) => {
  URL.revokeObjectURL(sprite.url);
  sprite.texture.destroy(false);
};

export const setSpritesAtom = atom(null, (get, set, sprites: tSprite[]) => {
  const oldSprites = get(spritesAtom);
  set(spritesAtom, sprites);
  for (const oldSprite of oldSprites) {
    cleanupSprite(oldSprite);
  }
});
export const addSpritesAtom = atom(null, (get, set, sprites: tSprite[]) => {
  set(spritesAtom, get(spritesAtom).concat(sprites));
});

export const removeSpritesAtom = atom(
  null,
  (get, set, id: string | string[]) => {
    const removedSprites: tSprite[] = [];
    const newSprites = get(spritesAtom).filter((sprite) => {
      const matched = Array.isArray(id)
        ? id.includes(sprite.id)
        : sprite.id === id;
      if (matched) {
        removedSprites.push(sprite);
      }
      return !matched;
    });
    set(spritesAtom, newSprites);
    if (!isEmpty(removedSprites)) {
      for (const sprite of removedSprites) {
        cleanupSprite(sprite);
      }
    }
    return removedSprites;
  },
);

export const updateSpriteAtom = atom(
  null,
  (get, set, id: string, updates: tUpdateSpriteData) => {
    set(
      spritesAtom,
      get(spritesAtom).map((sprite) => {
        if (sprite.id !== id) return sprite;
        const finalUpdates: Partial<tSprite> = { ...updates };
        if (updates.scale) {
          const updatedDimensions = calcSpriteDimensions({
            width: sprite.originalWidth,
            height: sprite.originalHeight,
            scale: updates.scale,
          });
          finalUpdates.width = updatedDimensions.width;
          finalUpdates.height = updatedDimensions.height;
        }
        return {
          ...sprite,
          ...finalUpdates,
        };
      }),
    );
  },
);
