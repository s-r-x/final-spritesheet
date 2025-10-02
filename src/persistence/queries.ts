import type {
  tDb,
  tDbQueries,
  tNormalizedPersistedSprite,
  tPersistedProjectWithThumb,
} from "./types";
import { asyncReduce } from "#utils/async-reduce";

export class DbQueries implements tDbQueries {
  constructor(private db: tDb) {}
  async getProjectsList(): Promise<{
    projects: tPersistedProjectWithThumb[];
  }> {
    const projects = await this.db.projects.toArray();
    return {
      projects,
    };
  }
  async getSpritesByProjectId(
    id: string,
  ): Promise<{ sprites: tNormalizedPersistedSprite[] }> {
    const res = await this.db.sprites.where("projectId").equals(id).toArray();
    const normalizedSprites = await asyncReduce(
      res,
      async (acc, sprite) => {
        const attachment = await this.db.blobs.get(sprite.blobId);
        if (attachment?.data) {
          acc.push({ ...sprite, blob: attachment.data });
        }
        return acc;
      },
      [] as tNormalizedPersistedSprite[],
    );
    return {
      sprites: normalizedSprites,
    };
  }
}
