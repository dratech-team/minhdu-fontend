interface VisibleEntity {
  readonly pinned: boolean;
  readonly visible: boolean;
}

export interface OrderVisibleEntity {
  readonly id: VisibleEntity;
  readonly stt: VisibleEntity;
  readonly customer: VisibleEntity;
  readonly createdAt: VisibleEntity;
  readonly explain: VisibleEntity;
  readonly commodityTotal: VisibleEntity;
  readonly paymentTotal: VisibleEntity;
  readonly deliveredAt: VisibleEntity;
  readonly commodities: VisibleEntity;
  readonly  currency: VisibleEntity;
  readonly routes: VisibleEntity;
  readonly  paidAt: VisibleEntity;
  readonly  payType: VisibleEntity;
  readonly  paidTotal: VisibleEntity;
  readonly debt: VisibleEntity;
  readonly province: VisibleEntity;
  readonly district: VisibleEntity;
  readonly ward: VisibleEntity;
  readonly  isSelect: VisibleEntity;
  readonly endedAt: VisibleEntity;
  readonly  hide: VisibleEntity;
  readonly totalCommodity: VisibleEntity,
  readonly  expand: VisibleEntity,
  readonly  paymentHistories: VisibleEntity,
}
