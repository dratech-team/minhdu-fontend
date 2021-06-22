import { Employee } from 'apps/hr/src/app/pages/employee/+state/employee.interface';
import { Position } from './orgChart/position';



export interface WorkHistory {
  id: number,
  position:Position,
  createAt: Date,
  employees:Employee[]
}
