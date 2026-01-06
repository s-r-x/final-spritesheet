// AI GENERATED
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { exec } from "node:child_process";
import { nanoid } from "nanoid";

/**
 * Checks if a string is valid TypeScript by running tsc against a temp file.
 * @param code The TypeScript code string
 * @returns Promise<boolean> True if valid, False if errors found
 */
export async function isValidTypeScript(code: string): Promise<boolean> {
  const tempFileName = path.resolve(".", `${nanoid()}.ts`);

  try {
    // 1. Write the string to a temp file
    await fs.writeFile(tempFileName, code);

    // 2. Run tsc (or tsgo) on that file
    // --noEmit: Check for errors but don't generate a .js file
    // --skipLibCheck: Speed up the process by ignoring library definition errors
    const command = `npx tsgo ${tempFileName} --ignoreConfig --skipLibCheck --noEmit`;

    const result = await new Promise<boolean>((resolve) => {
      exec(command, (error, stdout, _stderr) => {
        if (error) {
          // tsc exits with a non-zero code if there are errors
          console.log(stdout); // tsc outputs errors to stdout
          resolve(false);
        } else {
          resolve(true);
        }
      });
      // 3. Clean up the temp file
    });
    await fs.unlink(tempFileName);
    return result;
  } catch (err) {
    // Cleanup if file writing failed
    if (await fileExists(tempFileName)) await fs.unlink(tempFileName);
    throw err;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.F_OK); // F_OK checks visibility/existence
    return true;
  } catch (_error) {
    return false; // File does not exist or is inaccessible
  }
}
