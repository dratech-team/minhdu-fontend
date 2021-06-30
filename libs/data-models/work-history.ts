import { Employee } from '.';
import { Position } from './orgChart/position';



export interface WorkHistory {
  id: number,
  position:Position,
  createdAt: Date,
  employees:Employee[]
}
