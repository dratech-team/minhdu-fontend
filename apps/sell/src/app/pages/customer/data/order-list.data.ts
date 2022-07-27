export interface OrderListFormType {
  createdAt: Date[] | null;
  deliveredAt: Date[] | null;
  province: string | null | undefined;
  explain: string | null | undefined;
}

export interface OrderListData {
  search: Partial<OrderListFormType>,
  isLoadMore: boolean
}
