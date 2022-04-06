import {VisibleEntity} from "@minhdu-fontend/data-models";

export interface StockVisibleEntity {
  readonly stt: VisibleEntity;
  readonly code: VisibleEntity;
  readonly name: VisibleEntity;
  readonly warehouseType: VisibleEntity;
  readonly price: VisibleEntity;
  readonly amount: VisibleEntity;
  readonly totalCash: VisibleEntity;
  readonly barcode: VisibleEntity;
  readonly provider: VisibleEntity;
  readonly discount: VisibleEntity;
  readonly exp: VisibleEntity;
  readonly unit: VisibleEntity;
  readonly createdAt: VisibleEntity;
}
