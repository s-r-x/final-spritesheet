import { useAtomValue, useStore } from "jotai";
import { packedSpritesAtom } from "./packed-sprites.atom";
import { useCallback } from "react";

export const usePackedSprites = () => {
  return useAtomValue(packedSpritesAtom);
};

export const useGetPackedSprites = () => {
  const atomsStore = useStore();
  return useCallback(() => {
    return atomsStore.get(packedSpritesAtom);
  }, []);
};
