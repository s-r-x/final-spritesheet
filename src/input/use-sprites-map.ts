import { useAtomValue, useStore } from "jotai";
import { spritesMapAtom } from "./sprites.atom";
import { useCallback } from "react";

export const useGetSpritesMap = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(spritesMapAtom);
  }, [atomsStore]);
};
export const useSpritesMap = () => {
  return useAtomValue(spritesMapAtom);
};
