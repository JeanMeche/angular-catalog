export function isDefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function parseNumber(str: string | undefined): number | undefined {
  const parsed = parseInt(str ?? '', 10);
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}
