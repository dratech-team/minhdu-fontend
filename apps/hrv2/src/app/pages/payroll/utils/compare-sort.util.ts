export const CompareSortUtil = (
  a: number | string | Date | undefined,
  b: number | string | Date | undefined, isAsc: boolean
) => {
  return a && b
    ? typeof a === 'string' && typeof b === "string"
      ? a.localeCompare(b) * (isAsc ? 1 : -1)
      : (a < b ? -1 : 1) * (isAsc ? 1 : -1)
    : 0
}
