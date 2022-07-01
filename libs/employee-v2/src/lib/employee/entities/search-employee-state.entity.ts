import { EmployeeStatusEnum, EmployeeType, FlatSalaryTypeEnum, GenderTypeEnum } from '@minhdu-fontend/enums';
import { BranchEntity, DepartmentEntity, PositionEntity } from '@minhdu-fontend/orgchart-v2';
import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface SearchEmployeeStateEntity {
  readonly name: string;
  readonly gender: GenderTypeEnum;
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
  readonly position: PositionEntity;
  readonly branch: BranchEntity;
  readonly status: EmployeeStatusEnum;
  readonly type: EmployeeType;
  readonly flatSalary: FlatSalaryTypeEnum;
  readonly department: DepartmentEntity;
  readonly phone: string;
  readonly identify: string;
  readonly address: string;
  readonly orderBy: string;
  readonly orderType: NzTableSortOrder;
}
