import fs from "node:fs";
import { ASSETS_FOLDER } from "./utils/normalize-asset-name";
export default async function setup() {
  await fs.promises.mkdir(ASSETS_FOLDER, { recursive: true });
}
