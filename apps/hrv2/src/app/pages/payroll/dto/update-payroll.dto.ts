import {BasePayrollEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {FlatSalary, RecipeType} from "@minhdu-fontend/enums";

export interface BaseUpdatePayrollDto extends BasePayrollEntity {
  readonly  workday: number,
  readonly isFlatSalary: FlatSalary,
  readonly tax: number,
  readonly positionId: number,
  readonly branchId: number,
  readonly recipeType: RecipeType
  readonly taxed: boolean
  readonly note?: string
}

export type UpdatePayrollDto = BaseUpdateDto<BaseUpdatePayrollDto>
