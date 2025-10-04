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
} from "./types";
import { generateUniqueName } from "#utils/generate-unique-name";
import type { tLogger } from "@/logger/types";

export class DbMutations implements tDbMutations {
  constructor(
    private _db: tDb,
    private _logger: Maybe<tLogger>,
  ) {}
  async createNewProject({
    id,
    name,
    createdAt,
  }: tCreateNewProjectData = {}): Promise<{
    project: tPersistedProject;
  }> {
    const project: tPersistedProject = {
      id: id || generateId(),
      name: name || generateUniqueName(),
      createdAt: createdAt || new Date().toISOString(),
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
