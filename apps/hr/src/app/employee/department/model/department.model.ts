import { Position } from '../../position/model/position.model';

export interface Department {
  id?: number;
  name?: string;
  color?: string;
  branchId?: number;
  positionIds?: number[];
}

export interface FullDepartment {
  id?: number;
  name?: string;
  color?: string;
  positions?: Position[];
}
