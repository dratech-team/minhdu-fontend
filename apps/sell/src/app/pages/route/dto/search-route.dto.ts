export interface SearchRouteDto {
  search: string,
  startedAt_start: Date,
  startedAt_end: Date,
  endedAt_start?: Date,
  endedAt_end?: Date,
  status: number
}
