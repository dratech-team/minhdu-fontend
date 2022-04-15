import { BaseSalaryEntity } from '../base/base-salary.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateSalaryDto extends BaseSalaryEntity {
  readonly salarySettingId: number
}

export type UpdateSalaryDto = BaseUpdateDto<BaseUpdateSalaryDto>
