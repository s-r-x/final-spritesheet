import { findNextPot } from "#utils/find-next-pot";
import { describe, expect, test } from "vitest";

describe("findNextPot function", () => {
  test("should return next power of 2", () => {
    expect(findNextPot(512)).toEqual(512);
    expect(findNextPot(500)).toEqual(512);
    expect(findNextPot(1022)).toEqual(1024);
    expect(findNextPot(1025)).toEqual(2048);
    expect(findNextPot(64)).toEqual(64);
    expect(findNextPot(3000)).toEqual(4096);
  });
});
