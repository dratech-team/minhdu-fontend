import {ContractTypeEnum} from "../enums/contract-type.enum";
import {EmployeeEntity} from "@minhdu-fontend/employee-v2";

export interface ContractEntity{
  id: number,
  code: number,
  type: ContractTypeEnum,
  name: string
  position: string,
  createdAt: Date,
  expiredAt: Date,
  employee: EmployeeEntity,
  employeeId: number
}
