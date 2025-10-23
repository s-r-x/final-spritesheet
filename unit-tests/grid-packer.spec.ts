import { describe, expect, test } from "vitest";
import { gridPacker } from "@/packer/grid.packer";
import type { tPackerReturnValue, tPackerSpriteExcerpt } from "@/packer/types";

describe("grid packer", () => {
  {
    const size = 20;
    const cellSize = 10;
    testPacker({
      size,
      binCount: 1,
      sprites: generateSprites(4, cellSize, cellSize),
      firstBinWidth: size,
      firstBinHeight: size,
      extraTests({ bins }) {
        const bin = bins[0];
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
      },
    });
  }
  {
    const cellSize = 15;
    testPacker({
      size: 20,
      binCount: 3,
      sprites: generateSprites(3, cellSize, cellSize),
      extraTests({ bins }) {
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
      },
    });
  }
  {
    const cellWidth = 10;
    const size = 22;
    const edgeSpacing = 1;
    testPacker({
      binCount: 1,
      sprites: generateSprites(2, cellWidth, 20),
      edgeSpacing,
      firstBinWidth: size,
      firstBinHeight: size,
      size,
      extraTests({ bins }) {
        const [bin] = bins;
        const [sprite1, sprite2] = bin.sprites;
        expect(sprite1.x).toEqual(edgeSpacing);
        expect(sprite1.y).toEqual(edgeSpacing);
        expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
        expect(sprite2.y).toEqual(edgeSpacing);
      },
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 22;
    const edgeSpacing = 1;
    testPacker({
      size,
      sprites: generateSprites(2, cellWidth, cellHeight),
      edgeSpacing,
      firstBinWidth: size,
      firstBinHeight: size,
      binCount: 1,
      extraTests({ bins }) {
        const [bin] = bins;
        expect(bin.width).toEqual(size);
        expect(bin.height).toEqual(size);
        const [sprite1, sprite2] = bin.sprites;
        expect(sprite1.x).toEqual(edgeSpacing);
        expect(sprite1.y).toEqual(edgeSpacing);
        expect(sprite2.x).toEqual(cellWidth + edgeSpacing);
        expect(sprite2.y).toEqual(edgeSpacing);
      },
    });
  }
  testPacker({
    sprites: generateSprites(1, 10, 10),
    size: 10,
    padding: 1,
    binCount: 1,
  });
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const padding = 1;
    testPacker({
      size,
      sprites: generateSprites(2, cellWidth, cellHeight),
      padding,
      firstBinWidth: size,
      firstBinHeight: cellHeight,
      binCount: 1,
      extraTests({ bins }) {
        const [sprite1, sprite2] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(cellWidth + 1);
        expect(sprite1.y).toEqual(0);
      },
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 20;
    const size = 21;
    const padding = 2;
    testPacker({
      sprites: generateSprites(2, cellWidth, cellHeight),
      size,
      binCount: 2,
      padding,
      extraTests({ bins }) {
        const [bin1, bin2] = bins;
        const [sprite1] = bin1.sprites;
        const [sprite2] = bin2.sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(0);
        expect(sprite2.y).toEqual(0);
      },
    });
  }
  {
    const cellWidth = 31;
    const cellHeight = 10;
    const size = 32;
    const spritesCount = 3;
    const padding = 1;
    testPacker({
      sprites: generateSprites(spritesCount, cellWidth, cellHeight),
      size,
      padding,
      binCount: 1,
      firstBinWidth: cellWidth,
      firstBinHeight: cellHeight * spritesCount + (spritesCount - 1) * padding,
      extraTests({ bins }) {
        const [sprite1, sprite2, sprite3] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(0);
        expect(sprite2.y).toEqual(cellHeight + padding);
        expect(sprite3.x).toEqual(0);
        expect(sprite3.y).toEqual(cellHeight * 2 + 2);
      },
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 10;
    const size = 27;
    const edgeSpacing = 2;
    const padding = 3;
    const spritesCount = 3;
    testPacker({
      size,
      padding,
      edgeSpacing,
      binCount: 1,
      sprites: generateSprites(spritesCount, cellWidth, cellHeight),
      firstBinWidth: cellWidth * 2 + edgeSpacing * 2 + padding,
      firstBinHeight: cellHeight * 2 + edgeSpacing * 2 + padding,
      extraTests({ bins }) {
        const [sprite1, sprite2, sprite3] = bins[0].sprites;
        expect(sprite1.x).toEqual(edgeSpacing);
        expect(sprite1.y).toEqual(edgeSpacing);
        expect(sprite2.x).toEqual(edgeSpacing + cellWidth + padding);
        expect(sprite2.y).toEqual(edgeSpacing);
        expect(sprite3.x).toEqual(edgeSpacing);
        expect(sprite3.y).toEqual(edgeSpacing + cellHeight + padding);
      },
    });
  }
  {
    const cellSize = 10;
    const size = 20;
    const spritesCount = 9;
    testPacker({
      sprites: generateSprites(spritesCount, cellSize, cellSize),
      size,
      binCount: 3,
      extraTests({ bins }) {
        expect(bins[0].sprites).toHaveLength(4);
        expect(bins[1].sprites).toHaveLength(4);
        expect(bins[2].sprites).toHaveLength(1);
      },
    });
  }
  {
    const size = 11;
    const cellHeight = 10;
    const cell1Width = 10;
    const cell2Width = 1;
    testPacker({
      size,
      binCount: 2,
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
      extraTests({ bins }) {
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
      },
    });
  }
  {
    const size = 11;
    const cellWidth = 10;
    const cell1Height = 10;
    const cell2Height = 1;
    testPacker({
      size,
      binCount: 2,
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
      extraTests({ bins }) {
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
      },
    });
  }
  {
    const size = 11;
    const cellSize = 1;
    const edgeSpacing = 5;
    testPacker({
      sprites: generateSprites(1, cellSize, cellSize),
      size,
      edgeSpacing,
      binCount: 1,
      extraTests({ bins }) {
        const sprite = bins[0].sprites[0];
        expect(sprite.x).toEqual(edgeSpacing);
        expect(sprite.y).toEqual(edgeSpacing);
      },
    });
  }
  {
    const cellSize = 10;
    const size = 10;
    const edgeSpacing = 1;
    testPacker({
      size,
      sprites: generateSprites(1, cellSize, cellSize),
      oversizedCount: 1,
      edgeSpacing,
    });
  }
  {
    const cellWidth = 11;
    const cellHeight = 11;
    const size = 10;
    testPacker({
      sprites: generateSprites(1, cellWidth, cellHeight),
      size,
      oversizedCount: 1,
    });
  }
  {
    const cellWidth = 10;
    const cellHeight = 11;
    const size = 10;
    testPacker({
      size,
      sprites: generateSprites(1, cellWidth, cellHeight),
      oversizedCount: 1,
    });
  }
  {
    const cellWidth = 11;
    const cellHeight = 10;
    const size = 10;
    testPacker({
      size,
      sprites: generateSprites(1, cellWidth, cellHeight),
      oversizedCount: 1,
    });
  }
  test("should pack into 1 bin, and drop other sprites if forceSingleBin is true", () => {
    const { bins, oversizedSprites } = gridPacker.pack({
      size: 10,
      forceSingleBin: true,
      sprites: generateSprites(2, 10, 10),
    });
    expect(bins).toHaveLength(1);
    expect(oversizedSprites).toHaveLength(1);
  });
});

function testPacker({
  sprites,
  size,
  binCount = 0,
  oversizedCount = 0,
  edgeSpacing = 0,
  padding = 0,
  extraTests,
  firstBinWidth,
  firstBinHeight,
}: {
  sprites: tPackerSpriteExcerpt[];
  binCount?: number;
  size: number;
  oversizedCount?: number;
  padding?: number;
  edgeSpacing?: number;
  extraTests?: (value: tPackerReturnValue) => any;
  firstBinWidth?: number;
  firstBinHeight?: number;
}): tPackerReturnValue {
  const parts: string[] = [];
  parts.push(
    "[" +
      sprites.map(({ width, height }) => `${width}x${height}`).join(", ") +
      "]",
  );
  const result = gridPacker.pack({
    size,
    sprites,
    padding,
    edgeSpacing,
  });
  parts.push(`${size}x${size}`);
  if (padding || edgeSpacing) {
    parts.push(`{ padding: ${padding}, edgeSpacing: ${edgeSpacing} } :`);
  }
  if (binCount) {
    parts.push(`should pack into ${binCount} bins`);
  }
  if (oversizedCount) {
    parts.push(`should have ${oversizedCount} oversized sprites`);
  }
  test(parts.join(" "), () => {
    expect(result.bins).toHaveLength(binCount);
    expect(result.oversizedSprites).toHaveLength(oversizedCount);
    if (firstBinWidth) {
      expect(result.bins[0].width).toEqual(firstBinWidth);
      expect(result.bins[0].height).toEqual(firstBinHeight);
    }
    extraTests?.(result);
  });
  return result;
}

function generateSprites(count: number, width: number, height: number) {
  return Array.from(Array(count)).map((_, i) => ({
    id: String(i),
    width,
    height,
  }));
}
