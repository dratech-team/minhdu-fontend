export interface ResponsePaginate<T> {
  total: number,
  data: T[],
}
