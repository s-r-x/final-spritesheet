import { generateId } from "#utils/generate-id";
import type {
  tCreateNewProjectData,
  tNormalizedPersistedSprite,
  tPersistedProject,
  tPersistedSprite,
  tUpdateProjectData,
  tDbMutations,
  tDb,
  tPersistedBlob,
  tPersistedFolder,
  tUpdateMultipleFoldersArgs,
  tUpdateFolderData,
  tPersistedCustomBin,
  tAddFolderData,
  tAddCustomBinData,
  tUpdateCustomBinData,
  tUpdateMultipleCustomBinsArgs,
} from "./types";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tLogger } from "@/logger/types";

export class DbMutations implements tDbMutations {
  constructor(
    private _db: tDb,
    private _logger: Maybe<tLogger>,
  ) {}
  async createNewProject({
    id = generateId(),
    name = generateUniqueName(),
    createdAt = new Date().toISOString(),
  }: tCreateNewProjectData = {}): Promise<{
    project: tPersistedProject;
  }> {
    const project: tPersistedProject = {
      id,
      name,
      createdAt,
    };
    await this._db.projects.put(project);
    this._logger?.debug({
      layer: "db",
      label: "projectCreated",
      data: { data: { project } },
    });
    return {
      project,
    };
  }

  async addSprite(baseSprite: tNormalizedPersistedSprite): Promise<{
    sprite: tPersistedSprite;
  }> {
    const { blob, ...sprite } = baseSprite;
    const blobId = generateId();
    const blobDoc: tPersistedBlob = {
      id: blobId,
      data: blob,
      projectId: sprite.projectId,
    };
    // TODO:: txn
    await this._db.blobs.add(blobDoc);
    const spriteDoc = {
      ...sprite,
      blobId,
    };
    await this._db.sprites.put(spriteDoc);
    this._logger?.debug({
      layer: "db",
      label: "spriteCreated",
      data: { data: { spriteDoc } },
    });
    return {
      sprite: spriteDoc,
    };
  }

  async updateProject(id: string, data: tUpdateProjectData) {
    const numUpdated = await this._db.projects.update(id, data);
    if (!numUpdated) {
      this._logger?.warn({
        layer: "db",
        label: "projectUpdateSkipped",
        data: { id },
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "projectUpdated",
        data: { id, data },
      });
    }
  }
  async removeProject(id: string) {
    // TODO:: txn
    await this._db.projects.delete(id);
    await this._db.sprites.where("projectId").equals(id).delete();
    await this._db.blobs.where("projectId").equals(id).delete();
    await this._db.folders.where("projectId").equals(id).delete();
    this._logger?.debug({
      layer: "db",
      label: "projectRemoved",
      data: { id },
    });
  }

  async updateSprite(
    id: string,
    data: Partial<Pick<tPersistedSprite, "name" | "scale">>,
  ) {
    const numUpdated = await this._db.sprites.update(id, data);
    if (!numUpdated) {
      this._logger?.warn({
        layer: "db",
        label: "spriteUpdateSkipped",
        data: { id },
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "spriteUpdated",
        data: { id, data },
      });
    }
  }

  async removeSprite(id: string) {
    const doc = await this._db.sprites.get(id);
    const blobId = doc?.blobId;
    // TODO:: txn
    if (doc) {
      await Promise.all([
        this._db.sprites.delete(id),
        blobId && this._db.blobs.delete(blobId),
      ]);
      this._logger?.debug({
        layer: "db",
        label: "spriteRemoved",
        data: { id },
      });
    } else {
      this._logger?.warn({
        layer: "db",
        label: "spriteRemoveSkipped",
        data: { id, reason: "not found" },
      });
    }
  }
  async addFolder({
    id = generateId(),
    name = generateUniqueName(),
    itemIds = [],
    createdAt = new Date().toISOString(),
    ...rest
  }: tAddFolderData): Promise<{
    folder: tPersistedFolder;
  }> {
    const folderDoc: tPersistedFolder = {
      id,
      name,
      itemIds,
      createdAt,
      ...rest,
    };
    this._logger?.debug({
      layer: "db",
      label: "folderCreated",
      data: { id, projectId: folderDoc.projectId },
    });
    await this._db.folders.put(folderDoc);
    return {
      folder: folderDoc,
    };
  }
  async updateFolder(id: string, data: tUpdateFolderData) {
    const numUpdated = await this._db.folders.update(id, data);
    if (!numUpdated) {
      this._logger?.warn({
        layer: "db",
        label: "folderUpdateSkipped",
        data: { id },
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "folderUpdated",
        data: { id, data },
      });
    }
  }
  async updateFolders(args: tUpdateMultipleFoldersArgs) {
    const numUpdated = await this._db.folders.bulkUpdate(
      args.map(({ id, data }) => ({ key: id, changes: data })),
    );
    if (numUpdated < args.length) {
      this._logger?.warn({
        layer: "db",
        label: "foldersUpdateSomeSkipped",
        data: args,
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "foldersUpdated",
        data: args,
      });
    }
  }
  async removeFolder(id: string) {
    const doc = await this._db.folders.get(id);
    if (doc) {
      // TODO:: txn
      await this._db.folders.delete(id);
      const spriteIds = doc.itemIds;
      this._logger?.debug({
        layer: "db",
        label: "folderRemoved",
        data: { id, projectId: doc.projectId, items: spriteIds },
      });
    } else {
      this._logger?.warn({
        layer: "db",
        label: "folderRemoveSkipped",
        data: { id, reason: "not found" },
      });
    }
  }
  async addCustomBin({
    id = generateId(),
    name = generateUniqueName(),
    itemIds = [],
    folderIds = [],
    createdAt = new Date().toISOString(),
    ...rest
  }: tAddCustomBinData): Promise<{
    bin: tPersistedCustomBin;
  }> {
    const binDoc: tPersistedCustomBin = {
      id,
      name,
      itemIds,
      folderIds,
      createdAt,
      ...rest,
    };
    this._logger?.debug({
      layer: "db",
      label: "customBinCreated",
      data: { id, projectId: binDoc.projectId },
    });
    await this._db.customBins.put(binDoc);
    return {
      bin: binDoc,
    };
  }
  async updateCustomBin(id: string, data: tUpdateCustomBinData) {
    const numUpdated = await this._db.customBins.update(id, data);
    if (!numUpdated) {
      this._logger?.warn({
        layer: "db",
        label: "customBinUpdateSkipped",
        data: { id },
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "customBinUpdated",
        data: { id, data },
      });
    }
  }
  async updateCustomBins(args: tUpdateMultipleCustomBinsArgs) {
    const numUpdated = await this._db.customBins.bulkUpdate(
      args.map(({ id, data }) => ({ key: id, changes: data })),
    );
    if (numUpdated < args.length) {
      this._logger?.warn({
        layer: "db",
        label: "customBinsUpdateSomeSkipped",
        data: args,
      });
    } else {
      this._logger?.debug({
        layer: "db",
        label: "customBinsUpdated",
        data: args,
      });
    }
  }
  async removeCustomBin(id: string) {
    const doc = await this._db.customBins.get(id);
    if (doc) {
      // TODO:: txn
      await this._db.customBins.delete(id);
      const spriteIds = doc.itemIds;
      this._logger?.debug({
        layer: "db",
        label: "customBinRemoved",
        data: { id, projectId: doc.projectId, items: spriteIds },
      });
    } else {
      this._logger?.warn({
        layer: "db",
        label: "customBinRemoveSkipped",
        data: { id, reason: "not found" },
      });
    }
  }
  async clearDatabase() {
    await Promise.all(this._db.tables.map((table) => table.clear()));
    this._logger?.debug({
      layer: "db",
      label: "dbCleared",
    });
  }
}
