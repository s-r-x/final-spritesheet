import { useAtomValue, useStore } from "jotai";
import {
  customBinsAtom,
  customBinsMapAtom,
  folderIdToCustomBinIdMapAtom,
  itemIdToCustomBinIdMapAtom,
  normalizedCustomBinsAtom,
} from "./custom-bins.atom";
import { useCallback } from "react";

export const useCustomBinsList = () => {
  return useAtomValue(customBinsAtom);
};
export const useNormalizedCustomBins = () => {
  return useAtomValue(normalizedCustomBinsAtom);
};
export const useCustomBinsMap = () => {
  return useAtomValue(customBinsMapAtom);
};
export const useGetCustomBinsMap = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(customBinsMapAtom);
  }, []);
};
export const useGetItemIdToCustomBinIdMap = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(itemIdToCustomBinIdMapAtom);
  }, [store]);
};
export const useGetFolderIdToCustomBinIdMap = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(folderIdToCustomBinIdMapAtom);
  }, []);
};
