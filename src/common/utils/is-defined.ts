export function isDefined<T>(
  value: T | null | undefined,
): value is Exclude<NonNullable<T>, false> {
  return value !== null && value !== undefined && value !== false;
}
