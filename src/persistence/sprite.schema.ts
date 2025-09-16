import { RxJsonSchema } from "rxdb";
import type { tPersistedSprite } from "./types";

export const spriteSchema: RxJsonSchema<tPersistedSprite> = {
  title: "sprite schema",
  version: 1,
  keyCompression: false,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: "string",
    },
    mime: {
      type: "string",
    },
    width: {
      type: "number",
    },
    height: {
      type: "number",
    },
    scale: {
      type: "number",
    },
    projectId: {
      type: "string",
      maxLength: 100,
    },
  },
  required: ["id", "name", "mime", "width", "height", "projectId"],
  indexes: ["projectId"],
  attachments: {
    encrypted: false,
  },
} as const;
