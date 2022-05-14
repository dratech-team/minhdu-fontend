import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddManyPayrollDto {
  createdAt: Date;
}

export type AddManyPayrollDto = BaseAddDto<BaseAddManyPayrollDto>
