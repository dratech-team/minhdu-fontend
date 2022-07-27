import { HideDebtStatusEnum } from '../../order/enums';

export interface OrderListFormType {
  createdAt: Date[] | null;
  deliveredAt: Date[] | null;
  province: string | null | undefined;
  hiddenDebt: HideDebtStatusEnum;
  explain: string | null | undefined;
}

export interface OrderListData {
  search: Partial<OrderListFormType>,
  isLoadMore: boolean
}
