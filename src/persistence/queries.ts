import type {
  tDb,
  tDbQueries,
  tNormalizedPersistedSprite,
  tPersistedProjectWithThumb,
} from "./types";
import { asyncReduce } from "#utils/async-reduce";
import { tryAsync } from "#utils/try-async";

export class DbQueries implements tDbQueries {
  constructor(private db: tDb) {}
  async getProjectsList(): Promise<{
    projects: tPersistedProjectWithThumb[];
  }> {
    const res = await this.db.projects.find().exec();
    const normalizedProjects = await asyncReduce(
      res,
      async (acc, project) => {
        const attachment = project.getAttachment("thumb");
        if (attachment) {
          const [err, blob] = await tryAsync(
            attachment.getData.bind(attachment),
          )();
          if (err) console.error(err);
          acc.push({
            ...project.toJSON(),
            thumb: blob,
          });
        } else {
          acc.push(project.toJSON());
        }
        return acc;
      },
      [] as tPersistedProjectWithThumb[],
    );
    return {
      projects: normalizedProjects,
    };
  }
  async getSpritesByProjectId(
    id: string,
  ): Promise<{ sprites: tNormalizedPersistedSprite[] }> {
    const res = await this.db.sprites
      .find({
        selector: {
          projectId: id,
        },
      })
      .exec();
    const normalizedSprites = await asyncReduce(
      res,
      async (acc, sprite) => {
        const attachment = sprite.getAttachment("blob");
        if (attachment) {
          const [err, blob] = await tryAsync(
            attachment.getData.bind(attachment),
          )();
          if (err) console.error(err);
          if (blob) {
            acc.push({
              ...sprite.toJSON(),
              blob: blob,
            });
          }
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
