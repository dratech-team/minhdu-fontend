export interface BaseSearchDto<E> {
  readonly take: number;
  readonly skip: number;
  readonly isPaginate?: boolean
  readonly search?: Partial<E>;
}
