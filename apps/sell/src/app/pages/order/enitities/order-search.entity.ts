import {PaidType} from "@minhdu-fontend/enums";
import {rangeDay} from "@minhdu-fontend/data-models";

export interface OrderSearchEntity {
  search: string,
  paidType: PaidType | '',
  customer: string,
  status: number,
  explain: string,
  endedAt: rangeDay,
  createdAt: rangeDay,
  deliveredAt?: rangeDay,
  commodityTotal?: number,
  province?: string,
  bsx?: string,
  commodity?: string
}
