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

export class DbMutations implements tDbMutations {
  constructor(private db: tDb) {}
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
    await this.db.projects.put(project);
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
    await this.db.blobs.add(blobDoc);
    const spriteDoc = {
      ...sprite,
      blobId,
    };
    await this.db.sprites.put(spriteDoc);
    return {
      sprite: spriteDoc,
    };
  }

  async updateProject(id: string, data: tUpdateProjectData) {
    const numUpdated = await this.db.projects.update(id, data);
    if (!numUpdated) {
      console.warn(`project ${id} hasn't been updated`);
    }
  }
  async removeProject(id: string) {
    // TODO:: txn
    await this.db.projects.delete(id);
    await this.db.sprites.where("projectId").equals(id).delete();
    await this.db.blobs.where("projectId").equals(id).delete();
  }

  async updateSprite(
    id: string,
    data: Partial<Pick<tPersistedSprite, "name" | "scale">>,
  ) {
    const numUpdated = await this.db.sprites.update(id, data);
    if (!numUpdated) {
      console.warn(`sprite ${id} hasn't been updated`);
    }
  }

  async removeSprite(id: string) {
    const doc = await this.db.sprites.get(id);
    const blobId = doc?.blobId;
    // TODO:: txn
    if (doc) {
      await Promise.all([
        this.db.sprites.delete(id),
        blobId && this.db.blobs.delete(blobId),
      ]);
    }
  }
}
