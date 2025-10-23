import type {
  tOutputFramework,
  tPackerAlgorithm,
  tPackerMultipackMode,
} from "#config";
import type Dexie from "dexie";
import type { EntityTable } from "dexie";

export type tPersistedBlob = {
  id: string;
  projectId: string;
  data: Blob;
};
export type tPersistedProject = {
  id: string;
  name: string;
  packerAlgorithm?: tPackerAlgorithm;
  sheetMaxSize?: number;
  spritePadding?: number;
  edgeSpacing?: number;
  pot?: boolean;
  allowRotation?: boolean;
  framework?: tOutputFramework;
  multipack?: tPackerMultipackMode;
  textureFormat?: string;
  dataFileName?: string;
  textureFileName?: string;
  pngCompression?: number;
  imageQuality?: number;
  createdAt?: string;
};
export type tPersistedProjectWithThumb = tPersistedProject & {
  thumb?: Maybe<Blob>;
};
export type tPersistedSprite = {
  id: string;
  name: string;
  mime: string;
  width: number;
  height: number;
  scale: number;
  projectId: string;
  blobId: string;
};
export type tNormalizedPersistedSprite = Omit<tPersistedSprite, "blobId"> & {
  blob: Blob;
};
export type tPersistedFolder = {
  id: string;
  name: string;
  projectId: string;
  itemIds: string[];
  isAnimation?: boolean;
  createdAt: string;
};

export type tDbCollections = {
  blobs: EntityTable<tPersistedBlob, "id">;
  sprites: EntityTable<tPersistedSprite, "id">;
  projects: EntityTable<tPersistedProject, "id">;
  folders: EntityTable<tPersistedFolder, "id">;
};
export type tDb = Dexie & tDbCollections;

export type tUpdateProjectData = Partial<
  Pick<
    tPersistedProject,
    | "edgeSpacing"
    | "allowRotation"
    | "spritePadding"
    | "sheetMaxSize"
    | "pot"
    | "packerAlgorithm"
    | "name"
    | "framework"
    | "textureFormat"
    | "dataFileName"
    | "textureFileName"
    | "pngCompression"
    | "imageQuality"
    | "multipack"
  > & {
    thumb: {
      data: Blob;
      mime: string;
    };
  }
>;
export type tCreateNewProjectData = {
  id?: string;
  name?: string;
  createdAt?: string;
};
export type tAddFolderData = Partial<Omit<tPersistedFolder, "projectId">> &
  Pick<tPersistedFolder, "projectId">;
export type tUpdateFolderData = Partial<
  Pick<tPersistedFolder, "itemIds" | "name" | "isAnimation">
>;
export type tUpdateMultipleFoldersArgs = {
  id: string;
  data: tUpdateFolderData;
}[];
export type tDbMutations = {
  createNewProject: ({
    name,
  }: tCreateNewProjectData) => Promise<{ project: tPersistedProject }>;
  addSprite: (
    sprite: tNormalizedPersistedSprite,
  ) => Promise<{ sprite: tPersistedSprite }>;
  updateProject: (id: string, data: tUpdateProjectData) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  updateSprite: (
    id: string,
    data: Partial<Pick<tPersistedSprite, "name" | "scale">>,
  ) => Promise<void>;
  removeSprite: (id: string) => Promise<void>;
  addFolder: (data: tAddFolderData) => Promise<{ folder: tPersistedFolder }>;
  updateFolder: (id: string, data: tUpdateFolderData) => Promise<void>;
  updateFolders: (args: tUpdateMultipleFoldersArgs) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;

  clearDatabase: () => Promise<void>;
};

export type tDbQueries = {
  getProjectsList: () => Promise<{ projects: tPersistedProjectWithThumb[] }>;
  getSpritesByProjectId: (id: string) => Promise<{
    sprites: tNormalizedPersistedSprite[];
  }>;
  getFoldersByProjectId: (
    id: string,
  ) => Promise<{ folders: tPersistedFolder[] }>;
};

export type tDbBackupFormat = Blob;
export type tDbImportExport = {
  importDb: (data: tDbBackupFormat) => Promise<void>;
  exportDb: () => Promise<tDbBackupFormat>;
};
