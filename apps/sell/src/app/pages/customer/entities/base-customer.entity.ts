import {CustomerResource, CustomerType, Gender} from "@minhdu-fontend/enums";
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseCustomerEntity extends  BaseEntity{
  type?: CustomerType,
  resource?: CustomerResource,
  phone?: string,
  gender?: Gender
  isPotential?: boolean,
}
