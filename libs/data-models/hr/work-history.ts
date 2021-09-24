import { Branch, Employee } from '../index';
import { Position } from './orgChart/position';

export interface WorkHistory {
  id: number;
  position: Position;
  branch: Branch;
  createdAt: Date;
  employees: Employee[];
}
