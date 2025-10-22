export function invariant(condition: any, message?: string): asserts condition {
  if (condition) return;
  const error = new Error(message || "Unspecified error");

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, invariant);
  }

  throw error;
}
