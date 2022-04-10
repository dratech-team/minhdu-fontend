import {VisibleEntity} from "@minhdu-fontend/data-models";

export interface IoiReceiptVisibleEntity {
  readonly stt: VisibleEntity;
  readonly discount: VisibleEntity;
  readonly createdAt: VisibleEntity;
  readonly type: VisibleEntity
  readonly accountedAt: VisibleEntity,
  readonly billedAt: VisibleEntity,
  readonly billCode: VisibleEntity,
  readonly discountType: VisibleEntity;
  readonly orderedAt: VisibleEntity
  readonly importedAt: VisibleEntity
  readonly completedAt: VisibleEntity
  readonly approvedAt: VisibleEntity
  readonly note: VisibleEntity
  readonly attachment: VisibleEntity
  readonly product: VisibleEntity;
  readonly consignment: VisibleEntity
  readonly branch: VisibleEntity;
  readonly tax: VisibleEntity;
}
