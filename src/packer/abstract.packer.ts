import { findNextPot } from "#utils/find-next-pot";
import { findPrevPot } from "#utils/find-prev-pot";
import { atomsStore } from "@/common/atoms/atoms-store";
import type {
  tPackedBin,
  tPacker,
  tPackerOptions,
  tPackerReturnValue,
} from "./types";
import { loggerAtom } from "@/logger/logger.atom";

export abstract class AbstractPacker implements tPacker {
  protected _options: Required<tPackerOptions> & { initialSize: number } =
    undefined!;
  private get _logger() {
    return atomsStore.get(loggerAtom);
  }
  protected _setOptions(options: tPackerOptions) {
    const {
      padding = 0,
      edgeSpacing = 0,
      pot = false,
      forceSingleBin = false,
      allowRotation = false,
      ...rest
    } = options;
    this._options = {
      ...rest,
      padding,
      edgeSpacing,
      allowRotation,
      forceSingleBin,
      pot,
      size: options.pot ? findPrevPot(options.size) : options.size,
      initialSize: options.size,
    };
  }
  protected _normalizeBinDimensions(bin: tPackedBin) {
    bin.maxWidth = this._options.initialSize;
    bin.maxHeight = this._options.initialSize;
    if (this._options.pot) {
      const newWidth = findNextPot(bin.width);
      const newHeight = findNextPot(bin.height);
      const maxSize = this._options.size;
      if (newWidth > maxSize || newHeight > maxSize) {
        this._logger?.warn({
          layer: "app",
          label: "cannotNormalizeBinDimensions",
          data: {
            info: `Bin width (${bin.width}) or bin height (${bin.height}) is greater than max sheet size (${maxSize})`,
          },
        });
      } else {
        bin.width = newWidth;
        bin.height = newHeight;
      }
    }
  }
  public abstract pack(options: tPackerOptions): tPackerReturnValue;
}
