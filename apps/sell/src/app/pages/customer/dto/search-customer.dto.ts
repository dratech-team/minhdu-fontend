import {BaseCustomerEntity} from "../entities/base-customer.entity";

export interface SearchCustomerDto extends Omit<BaseCustomerEntity,'id'|'isPotential'> {
  readonly skip?: number,
  readonly take?: number,
  isPotential?: number,
  search?: string,
  orderBy?: string,
  orderType?: string
}
