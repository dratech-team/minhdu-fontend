export interface ResponsePaginate<T> {
  total: number,
  data: T[],
}
export interface LoadMore{
  take:number,
  skip:number,
  search?:string,
}
