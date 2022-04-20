import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseSalaryEntity} from "../../base";

export interface BaseAddAbsentSalaryDto extends BaseSalaryEntity {
  readonly payrollId: number;
  readonly settingId: number;
  readonly startedAt: Date;
  readonly endedAt: Date
}

export type AddAbsentSalaryDto = BaseAddDto<BaseAddAbsentSalaryDto>
