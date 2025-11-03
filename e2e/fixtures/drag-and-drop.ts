import type { Locator } from "@playwright/test";
import { invariant } from "../../src/common/utils/invariant";
export const dragAndDrop = async ({
  src,
  dst,
  position = "middle",
}: {
  src: Locator;
  dst: Locator;
  position?: "top" | "bottom" | "middle";
}) => {
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
  } else {
    dstY = dstBox.y + dstBox.height - 1;
  }
  await page.mouse.move(dstBox.x + dstBox.width / 2, dstY);
  await page.mouse.up();
};
