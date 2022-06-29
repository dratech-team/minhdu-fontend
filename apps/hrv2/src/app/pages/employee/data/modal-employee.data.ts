import { EmployeeEntity } from '@minhdu-fontend/employee-v2';
import { RequireOnlyOne } from '../../../../shared/types';

export interface ModalEmployee {
  add?: {
    employee?: EmployeeEntity;
  };
  update?: {
    employee: EmployeeEntity;
  };
}

export type ModalEmployeeData = RequireOnlyOne<ModalEmployee, 'add' | 'update'>;
