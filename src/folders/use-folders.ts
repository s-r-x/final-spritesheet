import { useAtomValue, useStore } from "jotai";
import {
  folderIdToNameMapAtom,
  foldersAtom,
  foldersMapAtom,
  itemIdToFolderIdMapAtom,
  normalizedFoldersAtom,
} from "./folders.atom";

export const useFoldersList = () => {
  return useAtomValue(foldersAtom);
};
export const useGetFoldersList = () => {
  const store = useStore();
  return () => store.get(foldersAtom);
};
export const useNormalizedFolders = () => {
  return useAtomValue(normalizedFoldersAtom);
};
export const useGetNormalizedFolders = () => {
  const store = useStore();
  return () => store.get(normalizedFoldersAtom);
};

export const useFolderIdToNameMap = () => {
  return useAtomValue(folderIdToNameMapAtom);
};

export const useFoldersMap = () => {
  return useAtomValue(foldersMapAtom);
};
export const useGetFoldersMap = () => {
  const store = useStore();
  return () => store.get(foldersMapAtom);
};

export const useItemIdToFolderIdMapAtom = () => {
  return useAtomValue(itemIdToFolderIdMapAtom);
};
export const useGetItemIdToFolderIdMap = () => {
  const store = useStore();
  return () => store.get(itemIdToFolderIdMapAtom);
};
