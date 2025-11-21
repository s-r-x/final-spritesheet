import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";
import { useFoldersMap } from "../folders/use-folders";
import { useSpritesMap } from "@/input/use-sprites-map";
import type { tSprite } from "@/input/types";

const QUERY_PARAMS_KEY = "animation_preview_folder";
export const useOpenAnimationPreview = () => {
  const setParams = useSetSearchParams();
  return (id: string) => {
    setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: id }));
  };
};
export const useCloseAnimationPreview = () => {
  return useGoBack();
};

export const useAnimationFrames = (): tSprite[] => {
  const searchParams = useSearchParams();
  const folderId = searchParams[QUERY_PARAMS_KEY];
  const foldersMap = useFoldersMap();
  const spritesMap = useSpritesMap();
  if (!folderId) return [];
  const folder = foldersMap[folderId];
  if (!folder) return [];
  return folder.itemIds.reduce((acc, spriteId) => {
    const sprite = spritesMap[spriteId];
    if (sprite) {
      acc.push(sprite);
    }
    return acc;
  }, [] as tSprite[]);
};
