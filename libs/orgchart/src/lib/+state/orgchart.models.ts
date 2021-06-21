/**
 * Interface for the 'Orgchart' data
 */
export interface BranchEntity {
  id: number;
  code: string;
  name: string
  departments: DepartmentEntity[]
}

export interface DepartmentEntity {
  id: number;
  name: string;
  positions: PositionEntity[]
}

export interface PositionEntity {
  id: number;
  name: string;
  workday: number;
}
