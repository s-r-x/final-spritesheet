import { useAtomValue, useStore } from "jotai";
import {
  hasAnyPackedSpritesAtom,
  packedSpritesAtom,
  packerStatusAtom,
} from "./packed-sprites.atom";

export const usePackedSprites = () => {
  return useAtomValue(packedSpritesAtom);
};

export const useGetPackedSprites = () => {
  const atomsStore = useStore();
  return () => atomsStore.get(packedSpritesAtom);
};

export const useHasAnyPackedSprites = () => {
  return useAtomValue(hasAnyPackedSpritesAtom);
};

export const usePackerStatus = () => {
  return useAtomValue(packerStatusAtom);
};
