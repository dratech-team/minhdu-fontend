import { Position } from './orgChart.interface/position.interface';
import { Employee } from '../../apps/hr/src/app/pages/employee/+state/employee/employee.interface';


export interface WorkHistory {
  id: number,
  position:Position,
  createAt: Date,
  employees:Employee[]
}
