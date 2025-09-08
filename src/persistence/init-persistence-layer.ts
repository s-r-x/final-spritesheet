import { EventBus } from "@/event-bus/event-bus";
import { createDb } from "./db";
import { DbMutations } from "./mutations";
import { DbQueries } from "./queries";
import { spriteToPersisted } from "@/sprites/sprites.mapper";

export const initPersistenceLayer = async () => {
  const db = await createDb();
  const mutations = new DbMutations(db);
  const queries = new DbQueries(db);
  const eventBus = EventBus.instance;
  const unsubProjectCreated = eventBus.on(
    "projectCreated",
    async ({ project }) => {
      await mutations.createNewProject(project);
    },
  );
  const unsubSpritesAdded = eventBus.on("spritesAdded", async ({ sprites }) => {
    for (const sprite of sprites) {
      await mutations.addSprite(spriteToPersisted(sprite));
    }
  });
  const unsubSpriteRemoved = eventBus.on("spritesRemoved", async ({ ids }) => {
    await Promise.all(ids.map((id) => mutations.removeSprite(id)));
  });
  const unsubOutputSettingsUpdated = eventBus.on(
    "outputSettingsUpdated",
    async ({ projectId, settings }) => {
      await mutations.updateProject(projectId, settings);
    },
  );
  const unsubPackerSettingsUpdated = eventBus.on(
    "packerSettingsUpdated",
    async ({ projectId, settings }) => {
      await mutations.updateProject(projectId, settings);
    },
  );
  const unsubSpriteUpdated = eventBus.on(
    "spriteUpdated",
    async ({ id, updates }) => {
      await mutations.updateSprite(id, updates);
    },
  );
  const unsubProjectUpdated = eventBus.on(
    "projectUpdated",
    async ({ id, updates }) => {
      await mutations.updateProject(id, updates);
    },
  );
  const unsubProjectRemoved = eventBus.on("projectRemoved", async ({ id }) => {
    await mutations.removeProject(id);
  });
  const detachListeners = () => {
    unsubProjectCreated();
    unsubSpritesAdded();
    unsubSpriteRemoved();
    unsubSpriteUpdated();
    unsubProjectUpdated();
    unsubProjectRemoved();
    unsubPackerSettingsUpdated();
    unsubOutputSettingsUpdated();
  };
  return { mutations, queries, detachListeners };
};
