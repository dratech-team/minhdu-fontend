import { Position } from './orgChart/position';
import { Branch } from './orgChart/branch';

export interface WorkHistories {
  id: number,
  position: Position,
  branch: Branch,
  createdAt: Date,
}
