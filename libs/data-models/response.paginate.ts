export interface ResponsePaginate<T> {
  total: number,
  data: T[],
}
export interface RequestPaginate{
  take:number,
  skip:number,
  search?:string,
}
