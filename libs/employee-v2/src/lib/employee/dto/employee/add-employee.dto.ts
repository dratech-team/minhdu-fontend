import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseEmployeeEntity } from '../../base';

export interface BaseAddEmployeeDto extends Omit<BaseEmployeeEntity, 'id'> {
  isFlatSalary: boolean;
  positionId: number;
  branchId: number;
  wardId: number;
  categoryId?: number;
  contract?: {
    createdAt?: Date;
    expiredAt?: Date;
  };
}

export type AddEmployeeDto = BaseAddDto<BaseAddEmployeeDto>;
