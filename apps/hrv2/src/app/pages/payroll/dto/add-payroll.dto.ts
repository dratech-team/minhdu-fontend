import {BasePayrollEntity} from "../bases";
import {EmployeeType} from "@minhdu-fontend/enums";

interface Generate {
  createdAt: Date,
  employeeId: number,
  employeeType: EmployeeType,
}

export interface AddPayrollDto extends Omit<BasePayrollEntity, 'id'> {
  generate: Generate;
  addOne?: boolean;
  inHistory?: boolean
}

