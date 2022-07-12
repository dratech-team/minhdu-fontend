export interface BaseSearchDto<E> {
  readonly isPaginate?: boolean; // if false ~ load lần đầu thì set lại trong store
  readonly search: Partial<E & {
    readonly take: number;
    readonly skip: number;
  }>;
}
