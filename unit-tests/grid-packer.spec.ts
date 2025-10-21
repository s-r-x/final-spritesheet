import { describe, expect, test } from "vitest";
import { gridPacker } from "@/packer/grid.packer";

describe("grid packer", () => {
  test("[10x10]x4 20x20 : should pack into 1 bin", () => {
    const cellSize = 10;
    const size = 20;
    const { bins } = gridPacker.pack({
      size,
      sprites: Array.from(Array(4)).map((_, n) => ({
        id: String(n),
        width: cellSize,
        height: cellSize,
      })),
    });
    expect(bins).toHaveLength(1);
    const bin = bins[0];
    expect(bin.width).toEqual(size);
    expect(bin.height).toEqual(size);
    expect(bin.sprites[0].x).toEqual(0);
    expect(bin.sprites[0].y).toEqual(0);
    expect(bin.sprites[0].id).toEqual("0");
    expect(bin.sprites[1].y).toEqual(0);
    expect(bin.sprites[1].x).toEqual(cellSize);
    expect(bin.sprites[1].id).toEqual("1");
    expect(bin.sprites[2].y).toEqual(cellSize);
    expect(bin.sprites[2].x).toEqual(0);
    expect(bin.sprites[2].id).toEqual("2");
    expect(bin.sprites[3].x).toEqual(cellSize);
    expect(bin.sprites[3].y).toEqual(cellSize);
    expect(bin.sprites[3].id).toEqual("3");
  });
  test("[15x15]x3 20x20 : should pack into 3 bins", () => {
    const cellSize = 15;
    const size = 20;
    const { bins } = gridPacker.pack({
      size,
      sprites: Array.from(Array(3)).map((_, n) => ({
        id: String(n),
        width: cellSize,
        height: cellSize,
      })),
    });
    expect(bins).toHaveLength(3);
    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];

      const sprite = bin.sprites[0];
      expect(bin.sprites).toHaveLength(1);
      expect(sprite.x).toEqual(0);
      expect(sprite.y).toEqual(0);
      expect(sprite.y).toEqual(0);
      expect(sprite.id).toEqual(String(i));
      expect(bin.width).toEqual(cellSize);
      expect(bin.height).toEqual(cellSize);
    }
  });
  test("[10x20]x2 22x22 (edge spacing: 1): should pack into 1 bin", () => {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 22;
    const edgeSpacing = 1;
    const { bins } = gridPacker.pack({
      size,
      edgeSpacing,
      sprites: Array.from(Array(2)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(1);
    const [bin] = bins;
    expect(bin.width).toEqual(size);
    expect(bin.height).toEqual(size);
    const [sprite1, sprite2] = bin.sprites;
    expect(sprite1.x).toEqual(edgeSpacing);
    expect(sprite1.y).toEqual(edgeSpacing);
    expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
    expect(sprite2.y).toEqual(edgeSpacing);
  });
  test("[10x10]x2 22x22 (edge spacing: 1): should pack into 1 bin", () => {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 22;
    const edgeSpacing = 1;
    const { bins } = gridPacker.pack({
      size,
      edgeSpacing,
      sprites: Array.from(Array(2)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(1);
    const [bin] = bins;
    expect(bin.width).toEqual(size);
    expect(bin.height).toEqual(size);
    const [sprite1, sprite2] = bin.sprites;
    expect(sprite1.x).toEqual(edgeSpacing);
    expect(sprite1.y).toEqual(edgeSpacing);
    expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
    expect(sprite2.y).toEqual(edgeSpacing);
  });
  test("[10x10]x1 10x10 (edge spacing: 1): should't pack ", () => {
    const edgeSpacing = 1;
    const { bins, oversizedSprites } = gridPacker.pack({
      size: 10,
      edgeSpacing,
      sprites: [
        {
          width: 10,
          height: 10,
          id: "1",
        },
      ],
    });
    expect(bins).toHaveLength(0);
    expect(oversizedSprites).toHaveLength(1);
  });
  test("[10x10]x1 10x10 (padding: 1): should pack into 1 bin", () => {
    const { bins } = gridPacker.pack({
      size: 10,
      padding: 1,
      sprites: [
        {
          width: 10,
          height: 10,
          id: "1",
        },
      ],
    });
    expect(bins).toHaveLength(1);
  });
  test("[10x20]x2 21x21 (padding: 1): should pack into 1 bin", () => {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const { bins } = gridPacker.pack({
      size,
      padding: 1,
      sprites: Array.from(Array(2)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(1);
    expect(bins[0].width).toEqual(size);
    expect(bins[0].height).toEqual(cellHeight);
    const [sprite1, sprite2] = bins[0].sprites;
    expect(sprite1.x).toEqual(0);
    expect(sprite1.y).toEqual(0);
    expect(sprite2.x).toEqual(cellWidth + 1);
    expect(sprite1.y).toEqual(0);
  });
  test("[10x20]x2 21x21 (padding: 2): should pack into 2 bins", () => {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const { bins } = gridPacker.pack({
      size,
      padding: 2,
      sprites: Array.from(Array(2)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(2);
    const [bin1, bin2] = bins;
    const [sprite1] = bin1.sprites;
    const [sprite2] = bin2.sprites;
    expect(sprite1.x).toEqual(0);
    expect(sprite1.y).toEqual(0);
    expect(sprite2.x).toEqual(0);
    expect(sprite2.y).toEqual(0);
  });
  test("[31x10]x3 32x32 (padding: 1): should pack into 1 bin", () => {
    const cellWidth = 31;
    const cellHeight = 10;
    const size = 32;
    const { bins } = gridPacker.pack({
      size,
      padding: 1,
      sprites: Array.from(Array(3)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(1);
    expect(bins[0].width).toEqual(cellWidth);
    expect(bins[0].height).toEqual(cellHeight * 3 + 2);
    const [sprite1, sprite2, sprite3] = bins[0].sprites;
    expect(sprite1.x).toEqual(0);
    expect(sprite1.y).toEqual(0);
    expect(sprite2.x).toEqual(0);
    expect(sprite2.y).toEqual(cellHeight + 1);
    expect(sprite3.x).toEqual(0);
    expect(sprite3.y).toEqual(cellHeight * 2 + 2);
  });
  test("[10x10]x3 27x27 (padding: 3,edgeSpacing: 2): should pack into 1 bin", () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const size = 27;
    const edgeSpacing = 2;
    const padding = 3;
    const { bins } = gridPacker.pack({
      size,
      padding,
      edgeSpacing,
      sprites: Array.from(Array(3)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(1);
    expect(bins[0].width).toEqual(cellWidth * 2 + edgeSpacing * 2 + padding);
    expect(bins[0].height).toEqual(cellHeight * 2 + edgeSpacing * 2 + padding);
    const [sprite1, sprite2, sprite3] = bins[0].sprites;
    expect(sprite1.x).toEqual(edgeSpacing);
    expect(sprite1.y).toEqual(edgeSpacing);
    expect(sprite2.x).toEqual(edgeSpacing + cellWidth + padding);
    expect(sprite2.y).toEqual(edgeSpacing);
    expect(sprite3.x).toEqual(edgeSpacing);
    expect(sprite3.y).toEqual(edgeSpacing + cellHeight + padding);
  });
  test("[10x10]x9 20x20 : should pack into 3 bins", () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const size = 20;
    const edgeSpacing = 0;
    const padding = 0;
    const { bins } = gridPacker.pack({
      size,
      padding,
      edgeSpacing,
      sprites: Array.from(Array(9)).map((_, n) => ({
        id: String(n),
        width: cellWidth,
        height: cellHeight,
      })),
    });
    expect(bins).toHaveLength(3);
    expect(bins[0].sprites).toHaveLength(4);
    expect(bins[1].sprites).toHaveLength(4);
    expect(bins[2].sprites).toHaveLength(1);
  });
});
