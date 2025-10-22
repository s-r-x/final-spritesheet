export function invariant(condition: any, message?: string) {
  if (condition) return;
  const error = new Error(message || "Unspecified error");

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, invariant);
  }

  throw error;
}
