import { describe, expect, test } from "vitest";
import { gridPacker } from "@/packer/grid.packer";

describe("grid packer", () => {
  {
    const size = 20;
    const cellSize = 10;
    const count = 4;
    const expectedBinCount = 1;
    test(`[${cellSize}x${cellSize}]x${count} ${size}x${size} : should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellSize,
          height: cellSize,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
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
  }
  {
    const cellSize = 15;
    const size = 20;
    const count = 3;
    const expectedBinCount = 3;
    test(`[${cellSize}x${cellSize}]x${count} ${size}x${size} : should pack into ${expectedBinCount} bins`, () => {
      const { bins } = gridPacker.pack({
        size,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellSize,
          height: cellSize,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
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
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 22;
    const edgeSpacing = 1;
    const count = 2;
    const expectedBinCount = 1;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (edge spacing: ${edgeSpacing}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        edgeSpacing,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      const [bin] = bins;
      expect(bin.width).toEqual(size);
      expect(bin.height).toEqual(size);
      const [sprite1, sprite2] = bin.sprites;
      expect(sprite1.x).toEqual(edgeSpacing);
      expect(sprite1.y).toEqual(edgeSpacing);
      expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
      expect(sprite2.y).toEqual(edgeSpacing);
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 22;
    const edgeSpacing = 1;
    const count = 2;
    const expectedBinCount = 1;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (edge spacing: ${edgeSpacing}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        edgeSpacing,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      const [bin] = bins;
      expect(bin.width).toEqual(size);
      expect(bin.height).toEqual(size);
      const [sprite1, sprite2] = bin.sprites;
      expect(sprite1.x).toEqual(edgeSpacing);
      expect(sprite1.y).toEqual(edgeSpacing);
      expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
      expect(sprite2.y).toEqual(edgeSpacing);
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 10;
    const count = 1;
    const size = 10;
    const padding = 1;
    const expectedBinCount = 1;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (padding: ${padding}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        padding,
        sprites: [
          {
            width: cellWidth,
            height: cellHeight,
            id: "1",
          },
        ],
      });
      expect(bins).toHaveLength(expectedBinCount);
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const expectedBinCount = 1;
    const padding = 1;
    const count = 2;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (padding: ${padding}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        padding: 1,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      expect(bins[0].width).toEqual(size);
      expect(bins[0].height).toEqual(cellHeight);
      const [sprite1, sprite2] = bins[0].sprites;
      expect(sprite1.x).toEqual(0);
      expect(sprite1.y).toEqual(0);
      expect(sprite2.x).toEqual(cellWidth + 1);
      expect(sprite1.y).toEqual(0);
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const expectedBinCount = 2;
    const padding = 2;
    const count = 2;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (padding: ${padding}): should pack into ${expectedBinCount} bins`, () => {
      const { bins } = gridPacker.pack({
        size,
        padding,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      const [bin1, bin2] = bins;
      const [sprite1] = bin1.sprites;
      const [sprite2] = bin2.sprites;
      expect(sprite1.x).toEqual(0);
      expect(sprite1.y).toEqual(0);
      expect(sprite2.x).toEqual(0);
      expect(sprite2.y).toEqual(0);
    });
  }
  {
    const cellWidth = 31;
    const cellHeight = 10;
    const size = 32;
    const count = 3;
    const padding = 1;
    const expectedBinCount = 1;
    test(`[${cellWidth}x${cellHeight}]x${3} ${size}x${size} (padding: ${padding}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        padding,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
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
  }
  {
    const cellWidth = 10;
    const cellHeight = 10;
    const size = 27;
    const edgeSpacing = 2;
    const padding = 3;
    const count = 3;
    const expectedBinCount = 1;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} (padding: ${padding}, edgeSpacing: ${edgeSpacing}): should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        padding,
        edgeSpacing,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellWidth,
          height: cellHeight,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      expect(bins[0].width).toEqual(cellWidth * 2 + edgeSpacing * 2 + padding);
      expect(bins[0].height).toEqual(
        cellHeight * 2 + edgeSpacing * 2 + padding,
      );
      const [sprite1, sprite2, sprite3] = bins[0].sprites;
      expect(sprite1.x).toEqual(edgeSpacing);
      expect(sprite1.y).toEqual(edgeSpacing);
      expect(sprite2.x).toEqual(edgeSpacing + cellWidth + padding);
      expect(sprite2.y).toEqual(edgeSpacing);
      expect(sprite3.x).toEqual(edgeSpacing);
      expect(sprite3.y).toEqual(edgeSpacing + cellHeight + padding);
    });
  }
  {
    const cellSize = 10;
    const size = 20;
    const count = 9;
    const expectedBinCount = 3;
    test(`[${cellSize}x${cellSize}]x${count} ${size}x${size} : should pack into ${expectedBinCount} bins`, () => {
      const { bins } = gridPacker.pack({
        size,
        sprites: Array.from(Array(count)).map((_, n) => ({
          id: String(n),
          width: cellSize,
          height: cellSize,
        })),
      });
      expect(bins).toHaveLength(expectedBinCount);
      expect(bins[0].sprites).toHaveLength(4);
      expect(bins[1].sprites).toHaveLength(4);
      expect(bins[2].sprites).toHaveLength(1);
    });
  }
  {
    const size = 11;
    const expectedBinCount = 2;
    const cellHeight = 10;
    const cell1Width = 10;
    const cell2Width = 1;
    test(`[${cell1Width}x${cellHeight}, ${cell2Width}x${cellHeight}] ${size}x${size} : should pack into ${expectedBinCount} bins`, () => {
      const { bins } = gridPacker.pack({
        size,
        sprites: [
          {
            id: "1",
            width: cell1Width,
            height: cellHeight,
          },
          {
            id: "2",
            width: cell2Width,
            height: cellHeight,
          },
        ],
      });
      expect(bins).toHaveLength(expectedBinCount);
      const firstSprite = bins[0].sprites[0];
      const secondSprite = bins[1].sprites[0];
      expect(firstSprite.id).toEqual("1");
      expect(firstSprite.x).toEqual(0);
      expect(firstSprite.y).toEqual(0);
      expect(secondSprite.id).toEqual("2");
      expect(bins[0].sprites).toHaveLength(1);
      expect(bins[1].sprites).toHaveLength(1);
      expect(secondSprite.x).toEqual(0);
      expect(secondSprite.y).toEqual(0);
    });
  }
  {
    const size = 11;
    const expectedBinCount = 2;
    const cellWidth = 10;
    const cell1Height = 10;
    const cell2Height = 1;
    test(`[${cellWidth}x${cell1Height}, ${cellWidth}x${cell2Height}] ${size}x${size} : should pack into ${expectedBinCount} bins`, () => {
      const { bins } = gridPacker.pack({
        size,
        sprites: [
          {
            id: "1",
            width: cellWidth,
            height: cell1Height,
          },
          {
            id: "2",
            width: cellWidth,
            height: cell2Height,
          },
        ],
      });
      expect(bins).toHaveLength(expectedBinCount);
      const firstSprite = bins[0].sprites[0];
      const secondSprite = bins[1].sprites[0];
      expect(firstSprite.id).toEqual("1");
      expect(firstSprite.x).toEqual(0);
      expect(firstSprite.y).toEqual(0);
      expect(secondSprite.id).toEqual("2");
      expect(bins[0].sprites).toHaveLength(1);
      expect(bins[1].sprites).toHaveLength(1);
      expect(secondSprite.x).toEqual(0);
      expect(secondSprite.y).toEqual(0);
    });
  }
  {
    const size = 11;
    const cellSize = 1;
    const edgeSpacing = 5;
    const expectedBinCount = 1;
    test(`[${cellSize}x${cellSize}] ${size}x${size} (edgeSpacing: ${edgeSpacing}) : should pack into ${expectedBinCount} bin`, () => {
      const { bins } = gridPacker.pack({
        size,
        edgeSpacing,
        sprites: [
          {
            id: "1",
            width: cellSize,
            height: cellSize,
          },
        ],
      });
      expect(bins).toHaveLength(expectedBinCount);
      const sprite = bins[0].sprites[0];
      expect(sprite.x).toEqual(edgeSpacing);
      expect(sprite.y).toEqual(edgeSpacing);
    });
  }
  {
    const cellSize = 10;
    const count = 1;
    const size = 10;
    const edgeSpacing = 1;
    test(`[${cellSize}x${cellSize}]x${count} ${size}x${size} (edge spacing: ${edgeSpacing}): shouldn't pack `, () => {
      const edgeSpacing = 1;
      const { bins, oversizedSprites } = gridPacker.pack({
        size,
        edgeSpacing,
        sprites: [
          {
            width: cellSize,
            height: cellSize,
            id: "1",
          },
        ],
      });
      expect(bins).toHaveLength(0);
      expect(oversizedSprites).toHaveLength(1);
    });
  }
  {
    const cellWidth = 11;
    const cellHeight = 11;
    const count = 1;
    const size = 10;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} : shouldn't pack `, () => {
      const { bins, oversizedSprites } = gridPacker.pack({
        size,
        sprites: [
          {
            width: cellWidth,
            height: cellHeight,
            id: "1",
          },
        ],
      });
      expect(bins).toHaveLength(0);
      expect(oversizedSprites).toHaveLength(1);
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 11;
    const count = 1;
    const size = 10;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} : shouldn't pack `, () => {
      const { bins, oversizedSprites } = gridPacker.pack({
        size,
        sprites: [
          {
            width: cellWidth,
            height: cellHeight,
            id: "1",
          },
        ],
      });
      expect(bins).toHaveLength(0);
      expect(oversizedSprites).toHaveLength(1);
    });
  }
  {
    const cellWidth = 11;
    const cellHeight = 10;
    const count = 1;
    const size = 10;
    test(`[${cellWidth}x${cellHeight}]x${count} ${size}x${size} : shouldn't pack `, () => {
      const { bins, oversizedSprites } = gridPacker.pack({
        size,
        sprites: [
          {
            width: cellWidth,
            height: cellHeight,
            id: "1",
          },
        ],
      });
      expect(bins).toHaveLength(0);
      expect(oversizedSprites).toHaveLength(1);
    });
  }
});
