import {VisibleEntity} from "@minhdu-fontend/data-models";

export interface OrderVisibleEntity {
  readonly stt: VisibleEntity;
  readonly customer: VisibleEntity;
  readonly createdAt: VisibleEntity;
  readonly explain: VisibleEntity;
  readonly commodityTotal: VisibleEntity;
  readonly paymentTotal: VisibleEntity;
  readonly deliveredAt: VisibleEntity;
  readonly commodities: VisibleEntity;
  readonly currency: VisibleEntity;
  readonly paidAt: VisibleEntity;
  readonly payType: VisibleEntity;
  readonly paidTotal: VisibleEntity;
  readonly debt: VisibleEntity;
  readonly destination: VisibleEntity;
  readonly endedAt: VisibleEntity;
  readonly totalCommodity: VisibleEntity,
  readonly expand: VisibleEntity,
  readonly paymentHistories: VisibleEntity,
  readonly vans:VisibleEntity,
  readonly status:VisibleEntity,
}
