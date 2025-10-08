import type {
  tDb,
  tDbQueries,
  tNormalizedPersistedSprite,
  tPersistedFolder,
  tPersistedProjectWithThumb,
} from "./types";
import { asyncReduce } from "#utils/async-reduce";
import type { tLogger } from "@/logger/types";

export class DbQueries implements tDbQueries {
  constructor(
    private _db: tDb,
    private _logger: Maybe<tLogger>,
  ) {}
  async getProjectsList(): Promise<{
    projects: tPersistedProjectWithThumb[];
  }> {
    try {
      const projects = await this._db.projects.toArray();
      return {
        projects,
      };
    } catch (e) {
      this._logger?.error(e);
      return { projects: [] };
    }
  }
  async getSpritesByProjectId(
    id: string,
  ): Promise<{ sprites: tNormalizedPersistedSprite[] }> {
    try {
      const res = await this._db.sprites
        .where("projectId")
        .equals(id)
        .toArray();
      const normalizedSprites = await asyncReduce(
        res,
        async (acc, sprite) => {
          const attachment = await this._db.blobs.get(sprite.blobId);
          if (attachment?.data) {
            acc.push({ ...sprite, blob: attachment.data });
          } else {
            this._logger?.warn({
              layer: "db",
              label: "noSpriteBlob",
              data: { sprite, blob: attachment },
            });
          }
          return acc;
        },
        [] as tNormalizedPersistedSprite[],
      );
      return {
        sprites: normalizedSprites,
      };
    } catch (e) {
      this._logger?.error(e);
      return { sprites: [] };
    }
  }
  async getFoldersByProjectId(
    id: string,
  ): Promise<{ folders: tPersistedFolder[] }> {
    try {
      const folders = await this._db.folders
        .where("projectId")
        .equals(id)
        .toArray();
      return { folders };
    } catch (e) {
      this._logger?.error(e);
      return { folders: [] };
    }
  }
}
