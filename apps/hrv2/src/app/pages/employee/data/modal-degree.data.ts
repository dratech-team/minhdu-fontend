import { DegreeEntity } from '../../../../../../../libs/employee-v2/src/lib/employee/entities/degree.entity';

export interface ModalDegreeData {
  employeeId: number;
  update?: {
    degree: DegreeEntity;
  };
}
