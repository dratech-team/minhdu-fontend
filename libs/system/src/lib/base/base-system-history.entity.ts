import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseSystemHistoryEntity extends BaseEntity{
  appName: string,
  name: string,
  activity: string
  description: string,
  ip: string,
  createdAt?: Date,
}
