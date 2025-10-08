import { useAtomValue } from "jotai";
import { foldersAtom, normalizedFoldersAtom } from "./folders.atom";

export const useFoldersList = () => {
  return useAtomValue(foldersAtom);
};
export const useNormalizedFolders = () => {
  return useAtomValue(normalizedFoldersAtom);
};
