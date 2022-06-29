import { VisibleEntity } from '@minhdu-fontend/data-models';

export interface StockVisibleEntity {
  readonly stt: VisibleEntity;
  readonly code: VisibleEntity;
  readonly name: VisibleEntity;
  readonly category: VisibleEntity;
  readonly supplier: VisibleEntity;
  readonly note: VisibleEntity;
  readonly unit: VisibleEntity;
}
