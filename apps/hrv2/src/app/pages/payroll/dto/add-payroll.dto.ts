import {BasePayrollEntity} from "../bases";

interface Generate {
  createdAt: Date,
  employeeId?: number;
}

export interface AddPayrollDto extends Omit<BasePayrollEntity, 'id'> {
  body: Generate;
  inHistory?: boolean
}

