import { isBoolean } from "#utils/is-boolean";
import { basicPacker } from "@/packer/basic.packer";
import type { tPackerReturnValue, tPackerSpriteExcerpt } from "@/packer/types";
import { describe, expect, test } from "vitest";

describe("basic packer", () => {
  testPacker({
    size: 10,
    binCount: 1,
    sprites: generateSprites(1, 10, 10),
    firstBinWidth: 10,
    firstBinHeight: 10,
    extraTests({ bins }) {
      const sprite = bins[0].sprites[0];
      expect(sprite.x).toEqual(0);
      expect(sprite.y).toEqual(0);
    },
  });
  {
    const cell1Width = 10;
    const cell2Width = 5;
    const cellHeight = 10;
    testPacker({
      size: 15,
      binCount: 1,
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
      firstBinWidth: 15,
      firstBinHeight: 10,
      extraTests({ bins }) {
        const [sprite1, sprite2] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(cell1Width);
        expect(sprite2.y).toEqual(0);
      },
    });
  }
  {
    const cellSize = 10;
    testPacker({
      binCount: 1,
      size: 20,
      sprites: generateSprites(4, cellSize, cellSize),
      firstBinWidth: 20,
      firstBinHeight: 20,
      extraTests({ bins }) {
        const [sprite1, sprite2, sprite3, sprite4] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(cellSize);
        expect(sprite2.y).toEqual(0);
        expect(sprite3.x).toEqual(0);
        expect(sprite3.y).toEqual(cellSize);
        expect(sprite4.x).toEqual(cellSize);
        expect(sprite3.y).toEqual(cellSize);
      },
    });
  }
  {
    const cellSize = 10;
    testPacker({
      size: 20,
      sprites: generateSprites(5, 10, 10),
      binCount: 2,
      firstBinWidth: 20,
      firstBinHeight: 20,
      extraTests({ bins }) {
        const [bin1, bin2] = bins;
        const [sprite1, sprite2, sprite3, sprite4] = bin1.sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(cellSize);
        expect(sprite2.y).toEqual(0);
        expect(sprite3.x).toEqual(0);
        expect(sprite3.y).toEqual(cellSize);
        expect(sprite4.x).toEqual(cellSize);
        expect(sprite3.y).toEqual(cellSize);
        expect(bin2.sprites[0].x).toEqual(0);
        expect(bin2.sprites[0].y).toEqual(0);
      },
    });
  }

  {
    const cellWidth = 5;
    const cellHeight = 10;
    const padding = 1;
    testPacker({
      size: 11,
      binCount: 1,
      padding: 1,
      sprites: generateSprites(2, cellWidth, cellHeight),
      firstBinWidth: 11,
      firstBinHeight: 10,
      extraTests({ bins }) {
        const [sprite1, sprite2] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(padding + cellWidth);
        expect(sprite2.y).toEqual(0);
      },
    });
  }

  {
    const cellWidth = 5;
    const cellHeight = 5;
    const padding = 1;
    testPacker({
      size: 11,
      sprites: generateSprites(4, cellWidth, cellHeight),
      binCount: 1,
      padding: 1,
      firstBinWidth: 11,
      firstBinHeight: 11,
      extraTests({ bins }) {
        const [sprite1, sprite2, sprite3, sprite4] = bins[0].sprites;
        expect(sprite1.x).toEqual(0);
        expect(sprite1.y).toEqual(0);
        expect(sprite2.x).toEqual(padding + cellWidth);
        expect(sprite2.y).toEqual(0);
        expect(sprite3.x).toEqual(0);
        expect(sprite3.y).toEqual(padding + cellHeight);
        expect(sprite4.x).toEqual(padding + cellWidth);
        expect(sprite4.y).toEqual(padding + cellHeight);
      },
    });
  }
  {
    const cellSize = 5;
    testPacker({
      size: 10,
      sprites: generateSprites(2, cellSize, cellSize),
      padding: 1,
      binCount: 2,
      firstBinWidth: 5,
      firstBinHeight: 5,
      extraTests({ bins }) {
        const [bin1, bin2] = bins;
        expect(bin1.sprites).toHaveLength(1);
        expect(bin2.sprites).toHaveLength(1);
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
    const cellSize = 5;
    const edgeSpacing = 1;
    testPacker({
      size: 7,
      sprites: generateSprites(1, cellSize, cellSize),
      binCount: 1,
      edgeSpacing,
      firstBinWidth: 7,
      firstBinHeight: 7,
      extraTests({ bins }) {
        const [sprite] = bins[0].sprites;
        expect(sprite.x).toEqual(edgeSpacing);
        expect(sprite.y).toEqual(edgeSpacing);
      },
    });
  }
  {
    const cellWidth = 5;
    const cellHeight = 10;
    const edgeSpacing = 1;
    const padding = 2;
    testPacker({
      size: 14,
      sprites: generateSprites(2, cellWidth, cellHeight),
      binCount: 1,
      edgeSpacing,
      padding,
      firstBinWidth: 14,
      firstBinHeight: 12,
      extraTests({ bins }) {
        const [sprite, sprite2] = bins[0].sprites;
        expect(sprite.x).toEqual(edgeSpacing);
        expect(sprite.y).toEqual(edgeSpacing);
        expect(sprite2.x).toEqual(cellWidth + edgeSpacing + padding);
        expect(sprite2.y).toEqual(edgeSpacing);
      },
    });
  }
  {
    const cellHeight = 10;
    const edgeSpacing = 1;
    const padding = 2;
    testPacker({
      size: 18,
      sprites: [
        {
          id: "100",
          width: 10,
          height: cellHeight,
        },
        ...generateSprites(2, 1, cellHeight),
      ],
      binCount: 1,
      edgeSpacing,
      padding,
      firstBinWidth: 18,
      firstBinHeight: 12,
      extraTests({ bins }) {
        const [sprite1, sprite2, sprite3] = bins[0].sprites;
        expect(sprite1.x).toEqual(edgeSpacing);
        expect(sprite1.y).toEqual(edgeSpacing);
        expect(sprite2.x).toEqual(10 + edgeSpacing + padding);
        expect(sprite2.y).toEqual(edgeSpacing);
        expect(sprite3.x).toEqual(11 + edgeSpacing + padding * 2);
        expect(sprite3.y).toEqual(edgeSpacing);
      },
    });
  }
  testPacker({
    size: 20,
    sprites: [
      {
        id: "1",
        width: 10,
        height: 10,
      },
      {
        id: "2",
        width: 5,
        height: 9,
      },
      {
        id: "3",
        width: 3,
        height: 8,
      },
      {
        id: "4",
        width: 4,
        height: 3,
      },
      {
        id: "5",
        width: 5,
        height: 2,
      },
      {
        id: "6",
        width: 10,
        height: 1,
      },
    ],
    binCount: 1,
    firstBinWidth: 19,
    firstBinHeight: 13,
    extraTests({ bins }) {
      const [bin] = bins;
      const [sprite1, sprite2, sprite3, sprite4, sprite5, sprite6] =
        bin.sprites;
      expect(sprite1.x).toEqual(0);
      expect(sprite1.y).toEqual(0);
      expect(sprite2.x).toEqual(10);
      expect(sprite2.y).toEqual(0);
      expect(sprite3.x).toEqual(15);
      expect(sprite3.y).toEqual(0);
      expect(sprite4.x).toEqual(0);
      expect(sprite4.y).toEqual(10);
      expect(sprite5.x).toEqual(4);
      expect(sprite5.y).toEqual(10);
      expect(sprite6.x).toEqual(9);
      expect(sprite6.y).toEqual(10);
    },
  });
  testPacker({
    size: 10,
    sprites: [
      {
        id: "1",
        width: 5,
        height: 1,
      },
      {
        id: "2",
        width: 6,
        height: 4,
      },
      {
        id: "3",
        width: 8,
        height: 2,
      },
    ],
    binCount: 1,
    firstBinHeight: 7,
    firstBinWidth: 8,
  });
  testPacker({
    size: 10,
    sprites: generateSprites(1, 11, 11),
    oversizedCount: 1,
  });
  testPacker({
    size: 11,
    sprites: generateSprites(1, 10, 10),
    edgeSpacing: 1,
    oversizedCount: 1,
  });
  testPacker({
    size: 10,
    sprites: generateSprites(1, 10, 11),
    edgeSpacing: 1,
    oversizedCount: 1,
  });
  testPacker({
    size: 10,
    sprites: generateSprites(1, 11, 10),
    oversizedCount: 1,
  });
  testPacker({
    size: 10,
    sprites: [
      {
        id: "1",
        width: 11,
        height: 11,
      },
      {
        id: "2",
        width: 5,
        height: 5,
      },
      {
        id: "3",
        width: 4,
        height: 4,
      },
    ],
    oversizedCount: 1,
    binCount: 1,
    extraTests({ bins }) {
      expect(bins[0].sprites).toHaveLength(2);
    },
  });
  testPacker({
    size: 10,
    sprites: generateSprites(1, 10, 10),
    oversizedCount: 1,
    pot: true,
  });
  testPacker({
    size: 66,
    sprites: generateSprites(2, 33, 33),
    binCount: 2,
    oversizedCount: 0,
    pot: true,
    firstBinWidth: 64,
    firstBinHeight: 64,
  });
  testPacker({
    size: 128,
    sprites: generateSprites(1, 100, 100),
    binCount: 1,
    pot: true,
    firstBinWidth: 128,
    firstBinHeight: 128,
  });
  testPacker({
    size: 128,
    sprites: generateSprites(1, 126, 126),
    edgeSpacing: 1,
    binCount: 1,
    pot: true,
    firstBinWidth: 128,
    firstBinHeight: 128,
  });
  testPacker({
    size: 32,
    sprites: generateSprites(1, 32, 32),
    binCount: 1,
    pot: true,
    firstBinWidth: 32,
    firstBinHeight: 32,
  });
  testPacker({
    size: 64,
    sprites: [...generateSprites(1, 30, 30), ...generateSprites(1, 34, 34)],
    binCount: 1,
    pot: true,
    firstBinWidth: 64,
    firstBinHeight: 64,
  });
  testPacker({
    size: 128,
    sprites: generateSprites(1, 7, 7),
    binCount: 1,
    pot: true,
    firstBinWidth: 8,
    firstBinHeight: 8,
  });
  testPacker({
    size: 32,
    sprites: generateSprites(1, 9, 10),
    binCount: 1,
    square: true,
    firstBinWidth: 10,
    firstBinHeight: 10,
  });
  testPacker({
    size: 16,
    sprites: generateSprites(2, 9, 4),
    binCount: 1,
    square: true,
    edgeSpacing: 1,
    padding: 2,
    firstBinWidth: 12,
    firstBinHeight: 12,
  });
  testPacker({
    size: 16,
    sprites: generateSprites(1, 9, 10),
    binCount: 1,
    square: true,
    pot: true,
    firstBinWidth: 16,
    firstBinHeight: 16,
  });
  testPacker({
    size: 8,
    sprites: [...generateSprites(1, 6, 8), ...generateSprites(1, 3, 4)],
    binCount: 2,
    square: true,
    firstBinWidth: 8,
    firstBinHeight: 8,
    extraTests({ bins }) {
      expect(bins[1].width).toEqual(4);
      expect(bins[1].height).toEqual(4);
    },
  });
  test("should pack into 1 bin, and drop other sprites if forceSingleBin is true", () => {
    const { bins, oversizedSprites } = basicPacker.pack({
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
  pot,
  square,
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
  pot?: boolean;
  square?: boolean;
}): tPackerReturnValue {
  const parts: string[] = [];
  parts.push(
    "[" +
      sprites.map(({ width, height }) => `${width}x${height}`).join(", ") +
      "]",
  );
  const result = basicPacker.pack({
    size,
    sprites,
    padding,
    edgeSpacing,
    pot,
    square,
  });
  parts.push(`${size}x${size}`);
  if (padding || edgeSpacing || isBoolean(pot) || isBoolean(square)) {
    const optsParts: string[] = [];
    if (padding) {
      optsParts.push(`padding: ${padding}`);
    }
    if (edgeSpacing) {
      optsParts.push(`edgeSpacing: ${edgeSpacing}`);
    }
    if (isBoolean(pot)) {
      optsParts.push(`pot: ${pot}`);
    }
    if (isBoolean(square)) {
      optsParts.push(`square: ${square}`);
    }
    parts.push("{" + optsParts.join(", ") + "}");
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
