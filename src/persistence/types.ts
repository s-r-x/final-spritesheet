import type { tPackerAlgorithm } from "@/packer/types";
import type { RxCollection, RxDatabase } from "rxdb";

export type tPersistedProject = {
  id: string;
  name: string;
  packerAlgorithm?: tPackerAlgorithm;
  sheetMaxSize?: number;
  spritePadding?: number;
  edgeSpacing?: number;
  pot?: boolean;
  allowRotation?: boolean;
  framework?: string;
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
};
export type tNormalizedPersistedSprite = Omit<tPersistedSprite, "blobId"> & {
  blob: Blob;
};

export type tDb = RxDatabase<{
  sprites: RxCollection<tPersistedSprite>;
  projects: RxCollection<tPersistedProject>;
}>;

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
};

export type tDbQueries = {
  getProjectsList: () => Promise<{ projects: tPersistedProjectWithThumb[] }>;
  getSpritesByProjectId: (id: string) => Promise<{
    sprites: tNormalizedPersistedSprite[];
  }>;
};
