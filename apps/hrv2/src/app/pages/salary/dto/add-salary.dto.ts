import { BaseSalaryEntity } from '../base';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

interface BaseAddSalaryDto extends BaseSalaryEntity {
  readonly salarySettingId: number;
}

export type AddSalaryDto = BaseAddDto<BaseAddSalaryDto>
