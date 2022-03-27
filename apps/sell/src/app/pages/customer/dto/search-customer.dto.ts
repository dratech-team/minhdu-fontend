import {BaseCustomerEntity} from "../entities/base-customer.entity";
import {CustomerType} from "@minhdu-fontend/enums";

export interface SearchCustomerDto extends Omit<BaseCustomerEntity,'id'|'isPotential'> {
  readonly skip?: number,
  readonly take?: number,
  isPotential?: number,
  search?: string,
  orderBy?: string,
  orderType?: string
}
