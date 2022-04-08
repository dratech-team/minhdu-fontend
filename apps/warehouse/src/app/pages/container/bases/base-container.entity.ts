import {BaseProductEntity} from "../../product/bases";

export interface BaseContainerEntity extends BaseProductEntity {
  readonly price: number,
  readonly amount: number
}
