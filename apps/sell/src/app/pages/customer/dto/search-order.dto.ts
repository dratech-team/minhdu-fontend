export interface SearchOrderDto {
  search: Partial<{ ranges: Date[] | null, ward: string | null | undefined, explain: string | null | undefined }>,
  isLoadMore: boolean
}
