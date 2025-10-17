import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { locationAtom } from "@/common/atoms/location.atom";
import { atom } from "jotai";
import type { tFolder } from "./types";
import { foldersAtom } from "./folders.atom";

export const useOpenFolderEditor = () => {
  const setId = useSetAtom(editableFolderAtom);
  return useCallback(
    (id: string) => {
      setId(id);
    },
    [setId],
  );
};
export const useCloseFolderEditor = () => {
  const setId = useSetAtom(editableFolderAtom);
  return useCallback(() => {
    setId(null);
  }, [setId]);
};

export const useEditableFolder = () => {
  const sprite = useAtomValue(editableFolderAtom);
  return sprite;
};

const QUERY_PARAMS_KEY = "editable_folder";
export const editableFolderAtom = atom<
  Maybe<tFolder> | "new",
  [Maybe<string>],
  void
>(
  (get) => {
    const id = get(locationAtom).searchParams?.get(QUERY_PARAMS_KEY);
    if (!id) return null;
    if (id === "new") return "new";
    return get(foldersAtom).find((folder) => folder.id === id) || null;
  },
  (get, set, id) => {
    const loc = get(locationAtom);
    if (loc.searchParams?.has(QUERY_PARAMS_KEY) && !id) {
      window.history.back();
      return;
    }
    set(locationAtom, (prev) => {
      const searchParams = new URLSearchParams(prev.searchParams);
      if (id) {
        searchParams.set(QUERY_PARAMS_KEY, id);
      }
      return {
        ...prev,
        searchParams,
      };
    });
  },
);
