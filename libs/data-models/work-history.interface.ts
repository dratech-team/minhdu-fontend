import { Employee } from 'apps/hr/src/app/pages/employee/+state/employee.interface';
import { Position } from './orgChart.interface/position.interface';



export interface WorkHistory {
  id: number,
  position:Position,
  createAt: Date,
  employees:Employee[]
}
