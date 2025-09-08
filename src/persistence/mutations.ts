import { generateId } from "#utils/generate-id";
import type {
  tCreateNewProjectData,
  tNormalizedPersistedSprite,
  tPersistedProject,
  tPersistedSprite,
  tUpdateProjectData,
  tDbMutations,
  tDb,
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
    const res = await this.db.projects.insert({
      id: id || generateId(),
      name: name || generateUniqueName(),
      createdAt: createdAt || new Date().toISOString(),
    });
    return {
      project: res.toJSON(),
    };
  }

  async addSprite(baseSprite: tNormalizedPersistedSprite): Promise<{
    sprite: tPersistedSprite;
  }> {
    const { blob, ...sprite } = baseSprite;
    const doc = await this.db.sprites.insert(sprite);
    await doc.putAttachment({
      id: "blob",
      data: blob,
      type: sprite.mime,
    });
    return {
      sprite: doc.toJSON(),
    };
  }

  async updateProject(id: string, data: tUpdateProjectData) {
    const project = await this.db.projects.findOne(id).exec(true);
    if (project) {
      const res = await project.update({
        $set: data,
      });
      if (data.thumb) {
        await res.putAttachment({
          id: "thumb",
          data: data.thumb.data,
          type: data.thumb.mime,
        });
      }
    }
  }
  async removeProject(id: string) {
    const doc = await this.db.projects.findOne(id).exec();
    if (doc) {
      await doc.remove();
    }
  }

  async updateSprite(
    id: string,
    data: Partial<Pick<tPersistedSprite, "name">>,
  ) {
    const sprites = await this.db.sprites.findOne(id).exec(true);
    if (sprites) {
      await sprites.update({
        $set: data,
      });
    }
  }

  async removeSprite(id: string) {
    const doc = await this.db.sprites.findOne(id).exec();
    if (doc) {
      await doc.remove();
    }
  }
}
