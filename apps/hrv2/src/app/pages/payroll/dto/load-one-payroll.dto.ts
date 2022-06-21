import {BaseLoadOneDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface LoadOnePayrollDto extends BaseLoadOneDto {
  updateOneSalary?: {
    salaryType: SalaryTypeEnum
    salaryId: number
  }
}
