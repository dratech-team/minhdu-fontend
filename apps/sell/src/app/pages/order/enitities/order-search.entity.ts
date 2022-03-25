import {PaidType} from "@minhdu-fontend/enums";
import {RangeDay} from "@minhdu-fontend/data-models";

export interface OrderSearchEntity {
  search: string,
  paidType: PaidType | '',
  customer: string,
  status: number,
  explain: string,
  endedAt_start: Date,
  endedAt_end: Date,
  createdAt_start: Date,
  createdAt_end: Date,
  deliveredAt_start?: Date,
  deliveredAt_end?: Date,
  commodityTotal?: number,
  province?: string,
  bsx?: string,
  commodity?: string
}
