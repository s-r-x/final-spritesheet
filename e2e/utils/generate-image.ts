// AI GENERATED
import sharp from "sharp";
import { normalizeAssetName } from "./normalize-asset-name";
import fs from "node:fs";

type ColorName =
  | "black"
  | "red"
  | "green"
  | "blue"
  | "white"
  | "yellow"
  | "cyan"
  | "magenta"
  | "gray"
  | "grey"
  | "orange"
  | "purple"
  | "pink"
  | "brown";

type ImageFormat = "jpg" | "jpeg" | "png" | "webp" | "gif" | "tiff" | "avif";

// Color mapping type
interface ColorMap {
  [key: string]: string;
}

/**
 * Generate a solid color image with specified dimensions
 * @param inputString - Format: "widthxheight-color.extension" or "widthxheight.extension"
 * @returns Promise with image generation result
 */
export async function generateImage(inputString: string): Promise<string> {
  const fileExists = await fs.promises
    .access(normalizeAssetName(inputString))
    .then(() => true)
    .catch(() => false);
  if (fileExists) {
    return normalizeAssetName(inputString);
  }
  try {
    // Parse the input string
    const regex = /^(\d+)x(\d+)(?:-([a-zA-Z]+))?\.([a-zA-Z]+)$/;
    const match = inputString.match(regex);

    if (!match) {
      throw new Error(
        'Invalid format. Use: "widthxheight-color.extension" or "widthxheight.extension"',
      );
    }

    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    const inputColor = match[3];
    const color = (inputColor || "black") as ColorName | string;
    const extension = match[4].toLowerCase() as ImageFormat;

    // Validate dimensions
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive numbers");
    }

    if (width > 10000 || height > 10000) {
      throw new Error("Width and height cannot exceed 10000 pixels");
    }

    // Color mapping
    const colorMap: ColorMap = {
      black: "#000000",
      red: "#FF0000",
      green: "#00FF00",
      blue: "#0000FF",
      white: "#FFFFFF",
      yellow: "#FFFF00",
      cyan: "#00FFFF",
      magenta: "#FF00FF",
      gray: "#808080",
      grey: "#808080",
      orange: "#FFA500",
      purple: "#800080",
      pink: "#FFC0CB",
      brown: "#A52A2A",
    };

    // Get hex color or use the input directly
    let hexColor: string = colorMap[color.toLowerCase()] || color;

    // Validate hex color format
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
      console.warn(`Color "${color}" not recognized, using black instead`);
      hexColor = "#000000";
    }

    // Supported formats
    const supportedFormats: ImageFormat[] = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "tiff",
      "avif",
    ];
    if (!supportedFormats.includes(extension)) {
      throw new Error(
        `Unsupported format: ${extension}. Supported: ${supportedFormats.join(", ")}`,
      );
    }

    // Generate filename

    const filename = normalizeAssetName(inputString);

    // Create solid color image
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 3,
        background: hexColor,
      },
    }).toFile(filename);
    return filename;
  } catch (error) {
    console.error(
      "❌ Error creating image:",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw error;
  }
}
