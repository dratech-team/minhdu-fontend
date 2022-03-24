import {PaidType} from "@minhdu-fontend/enums";
import {RangeDay} from "@minhdu-fontend/data-models";

export interface OrderSearchEntity {
  search: string,
  paidType: PaidType | '',
  customer: string,
  status: number,
  explain: string,
  endedAt: RangeDay,
  createdAt: RangeDay,
  deliveredAt?: RangeDay,
  commodityTotal?: number,
  province?: string,
  bsx?: string,
  commodity?: string
}
