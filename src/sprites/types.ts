import { type Texture } from "pixi.js";

export type tSprite = {
  id: string;
  projectId: string;
  name: string;
  mime: string;
  width: number;
  height: number;
  blob: Blob;
  texture: Texture;
  url: string;
};
