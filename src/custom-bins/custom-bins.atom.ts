import { atom } from "jotai";
import type {
  tCustomBin,
  tCustomBinsMap,
  tNormalizedCustomBin,
  tUpdateCustomBinData,
} from "./types";
import { isEmpty } from "#utils/is-empty";
import { spritesMapAtom } from "@/input/sprites.atom";
import { foldersMapAtom } from "@/folders/folders.atom";
import {
  DEFAULT_CUSTOM_BIN_ID,
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_POT,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_DEFAULT_SQUARE,
} from "#config";
import { activeProjectIdAtom } from "@/projects/projects.atom";
import type { tFolder } from "@/folders/types";
import type { tSprite } from "@/input/types";
import { sortBy } from "#utils/sort-by";

const customBinsAtom_ = atom<tCustomBin[]>([]);
export const customBinsAtom = atom(
  (get) => get(customBinsAtom_),
  (_get, set, value: tCustomBin[]) => {
    set(
      customBinsAtom_,
      sortBy(value, (bin) => bin.name, "asc"),
    );
  },
);

export const customBinsMapAtom = atom((get) => {
  return get(customBinsAtom).reduce((acc, bin) => {
    acc[bin.id] = bin;
    return acc;
  }, {} as tCustomBinsMap);
});

export const normalizedCustomBinsAtom = atom((get): tNormalizedCustomBin[] => {
  const bins = get(customBinsAtom);
  const itemsMap = new Map(Object.entries(get(spritesMapAtom)));
  const foldersMap = new Map(Object.entries(get(foldersMapAtom)));
  const normalizeFolder = (folder: tFolder) => {
    const items = folder.itemIds.reduce((acc, itemId) => {
      const sprite = itemsMap.get(itemId);
      if (sprite) {
        itemsMap.delete(sprite.id);
        acc.push(sprite);
      }
      foldersMap.delete(folder.id);
      return acc;
    }, [] as tSprite[]);
    return { folder, items };
  };
  const normalizedBins = bins.map((bin): tNormalizedCustomBin => {
    const items = bin.itemIds.reduce((acc, itemId) => {
      const item = itemsMap.get(itemId);
      if (item) {
        itemsMap.delete(itemId);
        acc.push(item);
      }
      return acc;
    }, [] as tSprite[]);
    const folders = bin.folderIds.reduce(
      (acc, folderId) => {
        const folder = foldersMap.get(folderId);
        if (!folder) return acc;
        const normalizedFolder = normalizeFolder(folder);
        acc.push(normalizedFolder);
        return acc;
      },
      [] as { folder: tFolder; items: tSprite[] }[],
    );
    return { bin, items, folders };
  });
  const normalizedFoldersWithoutBin = Array.from(foldersMap.values()).map(
    normalizeFolder,
  );
  const itemsWithoutBin = Array.from(itemsMap.values());
  const defaultBin: tNormalizedCustomBin = {
    bin: {
      id: DEFAULT_CUSTOM_BIN_ID,
      name: "root",
      projectId: get(activeProjectIdAtom)!,
      itemIds: itemsWithoutBin.map((item) => item.id),
      folderIds: normalizedFoldersWithoutBin.map(({ folder }) => folder.id),
      createdAt: "",
      useGlobalPackerOptions: true,
      packerAlgorithm: PACKER_DEFAULT_ALGORITHM,
      packerAllowRotation: PACKER_DEFAULT_ALLOW_ROTATION,
      packerSheetMaxSize: PACKER_DEFAULT_SHEET_SIZE,
      packerEdgeSpacing: PACKER_DEFAULT_EDGE_SPACING,
      packerPot: PACKER_DEFAULT_POT,
      packerSquare: PACKER_DEFAULT_SQUARE,
      packerSpritePadding: PACKER_DEFAULT_SPRITE_PADDING,
    },
    folders: normalizedFoldersWithoutBin,
    items: itemsWithoutBin,
  };
  normalizedBins.unshift(defaultBin);
  return normalizedBins;
});
export const itemIdToCustomBinIdMapAtom = atom((get) => {
  return get(customBinsAtom).reduce(
    (acc, bin) => {
      if (isEmpty(bin.itemIds)) return acc;
      for (const itemId of bin.itemIds) {
        acc[itemId] = bin.id;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
});

export const folderIdToCustomBinIdMapAtom = atom((get) => {
  return get(customBinsAtom).reduce(
    (acc, bin) => {
      if (isEmpty(bin.folderIds)) return acc;
      for (const folderId of bin.folderIds) {
        acc[folderId] = bin.id;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
});

export const addCustomBinsAtom = atom(null, (get, set, bins: tCustomBin[]) => {
  set(customBinsAtom, get(customBinsAtom).concat(bins));
});
export const removeCustomBinsAtom = atom(
  null,
  (get, set, id: string | string[]) => {
    const newBins = get(customBinsAtom).filter((bin) => {
      const matched = Array.isArray(id) ? id.includes(bin.id) : bin.id === id;
      return !matched;
    });
    set(customBinsAtom, newBins);
  },
);

export const updateCustomBinAtom = atom(
  null,
  (get, set, id: string, updates: tUpdateCustomBinData) => {
    set(
      customBinsAtom,
      get(customBinsAtom).map((bin) => {
        if (bin.id !== id) return bin;
        return { ...bin, ...updates };
      }),
    );
  },
);
export const updateCustomBinsAtom = atom(
  null,
  (get, set, data: Record<string, { data: tUpdateCustomBinData }>) => {
    set(
      customBinsAtom,
      get(customBinsAtom).map((bin) => {
        if (data[bin.id]) {
          return { ...bin, ...data[bin.id].data };
        }
        return bin;
      }),
    );
  },
);
