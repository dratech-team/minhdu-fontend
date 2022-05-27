import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseBranchEntity extends BaseEntity {
  code?: string,
  name: string,
  phone?: string
  address?: string
  status?: boolean
}
