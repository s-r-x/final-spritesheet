import type { tOutputSettings } from "@/output/types";
import type { tPackerSettings } from "@/packer/types";
import type { tProject } from "@/projects/types";
import type { tSprite, tUpdateSpriteData } from "@/sprites/types";

export type tEventMap = {
  spritesAdded: { sprites: tSprite[] };
  spritesRemoved: { ids: string[] };
  spriteUpdated: {
    id: string;
    updates: tUpdateSpriteData;
  };
  projectCreated: { project: tProject };
  projectUpdated: { id: string; updates: Partial<Pick<tProject, "name">> };
  projectRemoved: { id: string };
  outputSettingsUpdated: {
    projectId: string;
    settings: Partial<tOutputSettings>;
  };
  packerSettingsUpdated: {
    projectId: string;
    settings: Partial<tPackerSettings>;
  };
};

type tUnsubscribeFn = () => void;
export type tEventBus = {
  emit<K extends keyof tEventMap>(event: K, data: tEventMap[K]): void;

  on<K extends keyof tEventMap>(
    event: K,
    listener: (data: tEventMap[K]) => void,
  ): tUnsubscribeFn;

  off<K extends keyof tEventMap>(
    event: K,
    listener: (data: tEventMap[K]) => void,
  ): void;
};
