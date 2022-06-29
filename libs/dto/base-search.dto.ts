export interface BaseSearchDto<E> {
  readonly isPaginate?: boolean;
  readonly search: Partial<
    E & {
      readonly take: number;
      readonly skip: number;
    }
  >;
}
