import { atom } from "jotai";
import type { tFolder, tFolderWithItems, tUpdateFolderData } from "./types";
import { spritesMapAtom } from "@/input/sprites.atom";
import type { tSprite } from "@/input/types";
import { SPRITES_ROOT_FOLDER_ID } from "#config";
import { activeProjectIdAtom } from "@/projects/projects.atom";
import { isEmpty } from "#utils/is-empty";

export const foldersAtom = atom<tFolder[]>([]);

export const normalizedFoldersAtom = atom((get): tFolderWithItems[] => {
  const folders = get(foldersAtom);
  const itemsMap = new Map(Object.entries(get(spritesMapAtom)));
  const normalizedFolders = folders.map((folder): tFolderWithItems => {
    const items = folder.itemIds.reduce((acc, itemId) => {
      const item = itemsMap.get(itemId);
      if (item) {
        itemsMap.delete(itemId);
        acc.push(item);
      }
      return acc;
    }, [] as tSprite[]);
    return { folder, items };
  });
  const itemsWithoutFolder = Array.from(itemsMap.values());
  const emptyFolder: tFolderWithItems = {
    folder: {
      id: SPRITES_ROOT_FOLDER_ID,
      name: "root",
      isAnimation: false,
      projectId: get(activeProjectIdAtom)!,
      itemIds: itemsWithoutFolder.map((item) => item.id),
      createdAt: "",
    },
    items: itemsWithoutFolder,
  };
  normalizedFolders.unshift(emptyFolder);
  return normalizedFolders;
});

export const itemIdToFolderIdMapAtom = atom((get) => {
  return get(foldersAtom).reduce(
    (acc, folder) => {
      if (isEmpty(folder.itemIds)) return acc;
      for (const itemId of folder.itemIds) {
        acc[itemId] = folder.id;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
});

export const addFoldersAtom = atom(null, (get, set, folders: tFolder[]) => {
  set(foldersAtom, get(foldersAtom).concat(folders));
});
export const removeFoldersAtom = atom(
  null,
  (get, set, id: string | string[]) => {
    const newFolders = get(foldersAtom).filter((folder) => {
      const matched = Array.isArray(id)
        ? id.includes(folder.id)
        : folder.id === id;
      return !matched;
    });
    set(foldersAtom, newFolders);
  },
);
export const updateFolderAtom = atom(
  null,
  (get, set, id: string, updates: tUpdateFolderData) => {
    set(
      foldersAtom,
      get(foldersAtom).map((folder) => {
        if (folder.id !== id) return folder;
        return { ...folder, ...updates };
      }),
    );
  },
);
export const updateFoldersAtom = atom(
  null,
  (get, set, data: Record<string, { data: tUpdateFolderData }>) => {
    set(
      foldersAtom,
      get(foldersAtom).map((folder) => {
        if (data[folder.id]) {
          return { ...folder, ...data[folder.id].data };
        }
        return folder;
      }),
    );
  },
);
