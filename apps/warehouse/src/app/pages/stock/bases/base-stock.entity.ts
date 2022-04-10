import {BaseProductEntity} from "../../product/bases";

export interface BaseStockEntity extends BaseProductEntity {
  readonly price: number,
  readonly amount: number
}
