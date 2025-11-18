// AI GENERATED

export function stripFileExtension(filename: string): string {
  // 1. Find the index of the last dot in the string.
  const lastDotIndex = filename.lastIndexOf(".");

  // 2. Check for edge cases:
  // a) If no dot is found (lastDotIndex === -1), the file has no extension.
  // b) If the dot is the first character (lastDotIndex === 0), it's a dotfile (e.g., '.gitignore'),
  //    and we should treat it as having no extension part to strip.
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename;
  }

  // 3. Check for paths: If the last dot is preceded by a path separator (like '/'),
  //    it might be part of a directory name, but the general rule is to strip
  //    if the dot is not the first character. However, if dealing with paths,
  //    it's safest to first extract the basename, but for simple string stripping,
  //    the above checks are usually sufficient.

  // For standard filename stripping, we just slice the string before the last dot.
  return filename.slice(0, lastDotIndex);
}
