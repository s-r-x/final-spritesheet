import { Texture } from "pixi.js";
import { tSprite } from "./types";
import { generateId } from "#utils/generate-id";
import { tNormalizedPersistedSprite } from "@/persistence/types";

const loadImage = async (url: string): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = url;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  return img;
};
export const fileToSprite = async ({
  file,
  projectId,
}: {
  file: File;
  projectId: string;
}): Promise<tSprite> => {
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  const texture = Texture.from(img);
  return {
    id: generateId(),
    projectId,
    name: file.name,
    mime: file.type,
    texture,
    blob: file,
    width: texture.width,
    height: texture.height,
    url,
  };
};

export const persistedToSprite = async (
  sprite: tNormalizedPersistedSprite,
): Promise<tSprite> => {
  const url = URL.createObjectURL(sprite.blob);
  const img = await loadImage(url);
  const texture = Texture.from(img);
  return {
    projectId: sprite.projectId,
    id: sprite.id,
    name: sprite.name,
    mime: sprite.mime,
    texture,
    blob: sprite.blob,
    width: texture.width,
    height: texture.height,
    url,
  };
};
export const spriteToPersisted = (
  sprite: tSprite,
): tNormalizedPersistedSprite => {
  return {
    id: sprite.id,
    projectId: sprite.projectId,
    name: sprite.name,
    mime: sprite.mime,
    width: sprite.width,
    height: sprite.height,
    blob: sprite.blob,
  };
};
