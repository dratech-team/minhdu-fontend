import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseSalaryEntity} from "../../base";

export interface BaseAddPermanentSalaryDto extends BaseSalaryEntity {
  readonly payrollId: number;
}

export type AddPermanentSalaryDto = BaseAddDto<BaseAddPermanentSalaryDto>
