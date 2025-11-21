import { useAtomValue, useStore } from "jotai";
import { spritesMapAtom } from "./sprites.atom";

export const useGetSpritesMap = () => {
  const atomsStore = useStore();
  return () => atomsStore.get(spritesMapAtom);
};
export const useSpritesMap = () => {
  return useAtomValue(spritesMapAtom);
};
