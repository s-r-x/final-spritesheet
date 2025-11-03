import { findPrevPot } from "#utils/find-prev-pot";
import { describe, expect, test } from "vitest";

describe("findPrevpot function", () => {
  test("should return prev power of 2", () => {
    expect(findPrevPot(512)).toEqual(512);
    expect(findPrevPot(513)).toEqual(512);
    expect(findPrevPot(500)).toEqual(256);
  });
});
