import { Texture } from "pixi.js";
import type { tSprite } from "./types";
import { generateId } from "#utils/generate-id";
import type { tNormalizedPersistedSprite } from "@/persistence/types";
import { calcSpriteDimensions } from "./calc-sprite-dimensions";

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
  const width = texture.width;
  const height = texture.height;
  return {
    id: generateId(),
    projectId,
    name: file.name,
    mime: file.type,
    texture,
    blob: file,
    originalWidth: width,
    originalHeight: height,
    width,
    height,
    url,
    scale: 1,
  };
};

export const persistedToSprite = async (
  sprite: tNormalizedPersistedSprite,
): Promise<tSprite> => {
  const url = URL.createObjectURL(sprite.blob);
  const img = await loadImage(url);
  const texture = Texture.from(img);
  const originalWidth = texture.width;
  const originalHeight = texture.height;
  const scale = sprite.scale || 1;
  const { width, height } = calcSpriteDimensions({
    width: originalWidth,
    height: originalHeight,
    scale,
  });
  return {
    projectId: sprite.projectId,
    id: sprite.id,
    name: sprite.name,
    mime: sprite.mime,
    texture,
    blob: sprite.blob,
    originalWidth,
    originalHeight,
    width,
    height,
    url,
    scale,
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
    width: sprite.originalWidth,
    height: sprite.originalHeight,
    blob: sprite.blob,
    scale: sprite.scale,
  };
};
