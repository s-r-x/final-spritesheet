import { atom } from "jotai";
import type {
  tFolder,
  tFoldersMap,
  tNormalizedFolder,
  tUpdateFolderData,
} from "./types";
import { spritesMapAtom } from "@/input/sprites.atom";
import type { tSprite } from "@/input/types";
import { SPRITES_ROOT_FOLDER_ID } from "#config";
import { activeProjectIdAtom } from "@/projects/projects.atom";
import { isEmpty } from "#utils/is-empty";
import { selectAtom } from "jotai/utils";
import { sortBy } from "#utils/sort-by";

const foldersAtom_ = atom<tFolder[]>([]);
export const foldersAtom = atom(
  (get) => {
    return get(foldersAtom_);
  },
  (_get, set, folders: tFolder[]) => {
    set(
      foldersAtom_,
      sortBy(folders, (folder) => folder.name, "asc"),
    );
  },
);

export const foldersMapAtom = atom((get) => {
  return get(foldersAtom).reduce((acc, folder) => {
    acc[folder.id] = folder;
    return acc;
  }, {} as tFoldersMap);
});

export const normalizedFoldersAtom = atom((get): tNormalizedFolder[] => {
  const folders = get(foldersAtom);
  const itemsMap = new Map(Object.entries(get(spritesMapAtom)));
  const normalizedFolders = folders.map((folder): tNormalizedFolder => {
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
  const defaultFolder: tNormalizedFolder = {
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
  normalizedFolders.unshift(defaultFolder);
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

const foldersListForFolderIdToNameMapSelectAtom = selectAtom(
  foldersAtom,
  (folders) => folders.map((folder) => ({ id: folder.id, name: folder.name })),
  (a, b) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    return a.every((folder, i) => {
      return folder.id === b[i].id && folder.name === b[i].name;
    });
  },
);
export const folderIdToNameMapAtom = atom((get) => {
  const folders = get(foldersListForFolderIdToNameMapSelectAtom);
  return folders.reduce(
    (acc, folder) => {
      acc[folder.id] = folder.name;
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
