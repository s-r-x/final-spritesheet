import type { Locator } from "@playwright/test";
import { invariant } from "../../src/common/utils/invariant";
import { sleep } from "radash";
export const dragAndDrop = async ({
  src,
  dst,
  position = "middle",
  positionX = "middle",
}: {
  src: Locator;
  dst: Locator;
  position?: "top" | "bottom" | "middle" | number;
  positionX?: "start" | "middle" | "end" | number;
}) => {
  await Promise.all([
    src.waitFor({ state: "visible" }),
    dst.waitFor({ state: "visible" }),
  ]);
  const [srcBox, dstBox] = await Promise.all([
    src.boundingBox(),
    dst.boundingBox(),
  ]);
  invariant(srcBox && dstBox);
  const page = src.page();
  await page.mouse.move(
    srcBox.x + srcBox.width / 2,
    srcBox.y + srcBox.height / 2,
  );
  await page.mouse.down();
  let dstY: number;
  if (position === "top") {
    dstY = dstBox.y + 1;
  } else if (position === "middle") {
    dstY = dstBox.y + dstBox.height / 2;
  } else if (position === "bottom") {
    dstY = dstBox.y + dstBox.height - 1;
  } else if (typeof position === "number") {
    dstY = dstBox.y + position;
  } else {
    dstY = dstBox.y;
  }
  let dstX: number;
  if (positionX === "start") {
    dstX = dstBox.x + 1;
  } else if (positionX === "middle") {
    dstX = dstBox.x + dstBox.width / 2;
  } else if (positionX === "end") {
    dstX = dstBox.x + dstBox.width - 1;
  } else if (typeof positionX === "number") {
    dstX = dstBox.x + positionX;
  } else {
    dstX = dstBox.x + dstBox.width / 2;
  }
  await page.mouse.move(dstX, dstY);
  await sleep(1);
  await page.mouse.up();
};
