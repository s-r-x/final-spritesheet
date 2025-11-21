export function isDefined<T>(v: T | null | undefined): v is NonNullable<T> {
  return v !== undefined && v !== null;
}
