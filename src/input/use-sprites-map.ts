import { useAtomValue } from "jotai";
import { spritesMapAtom } from "./sprites.atom";

export const useSpritesMap = () => {
  return useAtomValue(spritesMapAtom);
};
