import { useAtomValue, useStore } from "jotai";
import {
  folderIdToNameMapAtom,
  foldersAtom,
  foldersMapAtom,
  itemIdToFolderIdMapAtom,
  normalizedFoldersAtom,
} from "./folders.atom";
import { useCallback } from "react";

export const useFoldersList = () => {
  return useAtomValue(foldersAtom);
};
export const useNormalizedFolders = () => {
  return useAtomValue(normalizedFoldersAtom);
};
export const useGetNormalizedFolders = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(normalizedFoldersAtom);
  }, [store]);
};

export const useFolderIdToNameMap = () => {
  return useAtomValue(folderIdToNameMapAtom);
};

export const useFoldersMap = () => {
  return useAtomValue(foldersMapAtom);
};
export const useGetFoldersMap = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(foldersMapAtom);
  }, [store]);
};

export const useItemIdToFolderIdMapAtom = () => {
  return useAtomValue(itemIdToFolderIdMapAtom);
};
export const useGetItemIdToFolderIdMap = () => {
  const store = useStore();
  return useCallback(() => {
    return store.get(itemIdToFolderIdMapAtom);
  }, [store]);
};
