import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseDegreeEntity} from "../../base/base-degree.entity";

export interface BaseUpdateDegreeDto extends BaseDegreeEntity {
  employeeId: number
}

export type UpdateDegreeDto = BaseUpdateDto<BaseUpdateDegreeDto>
