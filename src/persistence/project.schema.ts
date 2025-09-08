import { RxJsonSchema } from "rxdb";
import { tPersistedProject } from "./types";

export const projectSchema: RxJsonSchema<tPersistedProject> = {
  title: "project schema",
  version: 0,
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
    packerAlgorithm: {
      type: "string",
    },
    sheetMaxSize: {
      type: "number",
    },
    spritePadding: {
      type: "number",
    },
    edgeSpacing: {
      type: "number",
    },
    pot: {
      type: "boolean",
    },
    allowRotation: {
      type: "boolean",
    },
    framework: {
      type: "string",
    },
    textureFormat: {
      type: "string",
    },
    dataFileName: {
      type: "string",
    },
    textureFileName: {
      type: "string",
    },
    pngCompression: {
      type: "number",
    },
    imageQuality: {
      type: "number",
    },
    createdAt: {
      type: "string",
    },
  },
  required: ["id", "name", "createdAt"],
  attachments: {
    encrypted: false,
  },
} as const;
