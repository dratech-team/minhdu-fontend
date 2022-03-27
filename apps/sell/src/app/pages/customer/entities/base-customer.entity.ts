import {CustomerResource, CustomerType, Gender} from "@minhdu-fontend/enums";
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseCustomerEntity extends  Omit<BaseEntity,'type'>{
  customerType?: CustomerType,
  resource?: CustomerResource,
  phone?: string,
  gender?: Gender
  isPotential?: boolean,
}
