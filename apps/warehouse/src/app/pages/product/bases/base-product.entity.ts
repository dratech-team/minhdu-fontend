import {BaseEntity} from '@minhdu-fontend/base-entity';
import {CategoryUnitEnum} from "../../category/enums";
import {Branch} from "@minhdu-fontend/data-models";
import {TypeProductEnum} from "../enums";

export interface BaseProductEntity extends BaseEntity {
  readonly name: string;
  readonly code: string;
  readonly note?: string
  readonly unit: CategoryUnitEnum,
  readonly barcode?: string,
  readonly branches?: Branch[]
  readonly price: number,
  readonly type: TypeProductEnum
}
