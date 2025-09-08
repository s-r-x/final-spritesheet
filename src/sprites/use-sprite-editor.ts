import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { locationAtom } from "@/common/atoms/location.atom";
import { spritesAtom } from "@/sprites/sprites.atom";
import { atom } from "jotai";
import type { tSprite } from "@/sprites/types";

export const useOpenSpriteEditor = () => {
  const setId = useSetAtom(editableSpriteAtom);
  return useCallback(
    (id: string) => {
      setId(id);
    },
    [setId],
  );
};
export const useCloseSpriteEditor = () => {
  const setId = useSetAtom(editableSpriteAtom);
  return useCallback(() => {
    setId(null);
  }, [setId]);
};

export const useEditableSprite = () => {
  const sprite = useAtomValue(editableSpriteAtom);
  return sprite;
};

const QUERY_PARAMS_KEY = "editable_sprite";
export const editableSpriteAtom = atom<Maybe<tSprite>, [Maybe<string>], void>(
  (get) => {
    const id = get(locationAtom).searchParams?.get(QUERY_PARAMS_KEY);
    if (!id) return null;
    return get(spritesAtom).find((sprite) => sprite.id === id) || null;
  },
  (get, set, id) => {
    const loc = get(locationAtom);
    if (loc.searchParams?.has(QUERY_PARAMS_KEY) && !id) {
      window.history.back();
      return;
    }
    set(locationAtom, (prev) => {
      const searchParams = new URLSearchParams(prev.searchParams);
      if (id) {
        searchParams.set(QUERY_PARAMS_KEY, id);
      }
      return {
        ...prev,
        searchParams,
      };
    });
  },
);
