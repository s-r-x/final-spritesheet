import { useAtomValue, useStore } from "jotai";
import {
  customBinsAtom,
  customBinsMapAtom,
  folderIdToCustomBinIdMapAtom,
  itemIdToCustomBinIdMapAtom,
  normalizedCustomBinsAtom,
} from "./custom-bins.atom";

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
  return () => store.get(customBinsMapAtom);
};
export const useGetItemIdToCustomBinIdMap = () => {
  const store = useStore();
  return () => store.get(itemIdToCustomBinIdMapAtom);
};
export const useGetFolderIdToCustomBinIdMap = () => {
  const store = useStore();
  return () => store.get(folderIdToCustomBinIdMapAtom);
};
