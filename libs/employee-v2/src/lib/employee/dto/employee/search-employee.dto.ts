import { BaseEmployeeEntity } from '../../base';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { EmployeeStatusEnum, EmployeeType, FlatSalaryTypeEnum } from '@minhdu-fontend/enums';
import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface BaseSearchEmployeeDto extends BaseEmployeeEntity {
  readonly name: string;
  readonly province: string;
  readonly district: string;
  readonly ward: string;
  readonly position: string;
  readonly branch: string;
  readonly status: EmployeeStatusEnum;
  readonly type: EmployeeType;
  readonly isFlatSalary: FlatSalaryTypeEnum;
  readonly categoryId: number;
  readonly orderBy?: string;
  readonly orderType?: NzTableSortOrder;
}

export type SearchEmployeeDto = BaseSearchDto<BaseSearchEmployeeDto>;
