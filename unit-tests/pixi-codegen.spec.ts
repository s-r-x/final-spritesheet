import { generatePixiTSCode } from "@/codegen/pixi";
import { describe, expect, test } from "vitest";
import { isValidTypeScript } from "./utils/is-valid-typescript";
describe("pixi codegen", () => {
  test("should generate valid typescript code when animations are defined", async () => {
    const { code } = generatePixiTSCode({
      atlasFileName: "my-atlas.json",
      atlas: {
        frames: {
          "1": "any",
          two: "any",
        },
        animations: {
          one: ["1", "two"],
        },
      },
    });
    expect(await isValidTypeScript(code)).toBeTruthy();
  });
  test("should generate valid typescript code when animations are not defined", async () => {
    const { code } = generatePixiTSCode({
      atlasFileName: "my-atlas.json",
      atlas: {
        frames: {
          "1": "any",
        },
      },
    });
    expect(await isValidTypeScript(code)).toBeTruthy();
  });
});
