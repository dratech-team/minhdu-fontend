import {BaseEntity} from "@minhdu-fontend/base-entity";
import {EmployeeEntity} from "@minhdu-fontend/employee-v2";
import {ContractTypeEnum} from "../enums/contract-type.enum";

export interface BaseContractEntity extends BaseEntity {
  code: number,
  type: ContractTypeEnum,
  name: string
  position: string,
  createdAt: Date,
  expiredAt: Date,
  employeeId: number
}
