import { useAtomValue } from "jotai";
import { folderIdToNameMapAtom } from "./folders.atom";

export const useFolderIdToNameMap = () => {
  return useAtomValue(folderIdToNameMapAtom);
};
