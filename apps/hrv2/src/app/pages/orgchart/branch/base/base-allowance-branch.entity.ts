import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseAllowanceBranchEntity extends BaseEntity {
  title: string,
  price: number,
  datetime: Date,
  branchId: number
}
