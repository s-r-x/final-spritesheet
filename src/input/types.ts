import type { Texture } from "pixi.js";

export type tSprite = {
  id: string;
  projectId: string;
  name: string;
  mime: string;
  width: number;
  originalWidth: number;
  height: number;
  originalHeight: number;
  blob: Blob;
  texture: Texture;
  url: string;
  scale: number;
};
export type tSpritesMap = Record<string, tSprite>;

export type tUpdateSpriteData = Partial<Pick<tSprite, "name" | "scale">>;
