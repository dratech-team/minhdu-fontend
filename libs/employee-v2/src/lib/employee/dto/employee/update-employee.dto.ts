import { BaseEmployeeEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { FlatSalaryTypeEnum } from '@minhdu-fontend/enums';

export interface BaseUpdateEmployeeDto extends Omit<BaseEmployeeEntity, 'id'> {
  isFlatSalary: FlatSalaryTypeEnum;
  positionId: number;
  branchId: number;
  wardId: number;
  categoryId?: number;
  contract?: {
    createdAt?: Date;
    expiredAt?: Date;
  };
}

export type UpdateEmployeeDto = BaseUpdateDto<BaseUpdateEmployeeDto>;
