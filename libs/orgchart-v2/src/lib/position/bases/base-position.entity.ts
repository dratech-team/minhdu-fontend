import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BasePositionEntity extends BaseEntity{
  code?: string,
  name: string
  workday?: number,
}
