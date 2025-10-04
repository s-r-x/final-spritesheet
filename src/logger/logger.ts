import { BASE_URL, DEV, LOG_LEVELS } from "#config";
import { isDefined } from "#utils/is-defined";
import type { tLogger, tLoggerPayload, tLogLevel } from "./types";

export class Logger implements tLogger {
  public error = console.error.bind(console);
  public warn(payload: tLoggerPayload) {
    const level: tLogLevel = "warn";
    if (!LOG_LEVELS.has(level)) return;
    console.warn(...this._normalizePayload({ payload, level }));
  }
  public debug(payload: tLoggerPayload) {
    const level: tLogLevel = "info";
    if (!LOG_LEVELS.has(level)) return;
    console.debug(...this._normalizePayload({ payload, level }));
  }
  public info(payload: tLoggerPayload) {
    const level: tLogLevel = "info";
    if (!LOG_LEVELS.has(level)) return;
    console.info(...this._normalizePayload({ payload, level }));
  }
  private _normalizePayload({
    payload: { layer, label, data },
    level,
  }: {
    payload: tLoggerPayload;
    level: tLogLevel;
  }) {
    const consolePayload = [
      `${level.toUpperCase()}[${layer}]:: ${label}`,
      DEV
        ? this.parseStackLine(
            this._getCallerDetails(new Error().stack),
          )?.filePathWithLine?.replace(BASE_URL, "")
        : undefined,
      data,
    ].filter(isDefined);
    return consolePayload;
  }
  // getCallerDetails ignores source maps and points to the bundle file itself in production, which is not very useful. stacktrace.js is nice but heavy. it hangs firefox for a couple of seconds when generating stackframes if the console is opened

  private _getCallerDetails(
    stackTrace: Maybe<string> | undefined,
  ): Maybe<string> {
    if (!stackTrace) {
      return null;
    }

    const lines = stackTrace.split("\n");

    // --- Define patterns to filter out ---
    // 1. Filter lines that refer to the Logger class or its methods.
    //    Adjust 'Logger\.' if your class name is different.
    // 2. Filter lines that refer to the logger's filename (e.g., logger.ts)
    const exclusionPatterns = [
      /Error/, // Skip the first "Error" line
      /at Logger\./, // Skip internal methods like Logger.log or Logger.info
      /at new Logger/, // Skip the constructor call if present
      /\/logger\.ts/, // Skip lines originating from the logger file itself
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip lines that are too short or don't look like a stack frame
      if (trimmedLine.length < 5 || !trimmedLine.includes(":")) continue;

      let isInternalFrame = false;
      for (const pattern of exclusionPatterns) {
        if (pattern.test(trimmedLine)) {
          isInternalFrame = true;
          break;
        }
      }

      // If the line did NOT match any internal logger pattern, it's the external caller
      if (!isInternalFrame) {
        // Clean up common prefixes and return
        return trimmedLine.replace(/^\s*at\s*/, "").trim();
      }
    }

    return null;
  }
  // https://github.com/fullstack-build/tslog/blob/master/src/BaseLogger.ts#L213
  private parseStackLine(line?: Maybe<string>): Maybe<{
    fullFilePath?: string;
    fileName?: string;
    fileNameWithLine?: string;
    filePath?: string;
    fileLine?: string;
    fileColumn?: string;
    filePathWithLine?: string;
    method?: string;
  }> {
    if (!line) return null;
    const BROWSER_PATH_REGEX =
      /(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+){2,})(?::(\d+))?(?::(\d+))?/;
    const href = (globalThis as { location?: { origin?: string } }).location
      ?.origin;
    const match = line.match(BROWSER_PATH_REGEX);
    if (!match) {
      return null;
    }

    const filePath = match[1]?.replace(/\?.*$/, "");
    if (filePath == null) {
      return null;
    }

    const pathParts = filePath.split("/");
    const fileLine = match[2];
    const fileColumn = match[3];
    const fileName = pathParts[pathParts.length - 1];

    return {
      fullFilePath: href ? `${href}${filePath}` : filePath,
      fileName,
      fileNameWithLine:
        fileName && fileLine ? `${fileName}:${fileLine}` : undefined,
      fileColumn,
      fileLine,
      filePath,
      filePathWithLine: fileLine ? `${filePath}:${fileLine}` : undefined,
      method: undefined,
    };
  }
}
