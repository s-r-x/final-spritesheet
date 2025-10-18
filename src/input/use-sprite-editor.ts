import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";
import { useSpritesMap } from "./use-sprites-map";
import { useCallback } from "react";

const QUERY_PARAMS_KEY = "editable_sprite";
export const useOpenSpriteEditor = () => {
  const setParams = useSetSearchParams();
  return useCallback(
    (id: string) => {
      setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: id }));
    },
    [setParams],
  );
};
export const useCloseSpriteEditor = () => {
  return useGoBack();
};

export const useEditableSprite = () => {
  const searchParams = useSearchParams();
  const id = searchParams[QUERY_PARAMS_KEY];
  const spritesMap = useSpritesMap();
  if (!id) return null;
  return spritesMap[id] || null;
};
