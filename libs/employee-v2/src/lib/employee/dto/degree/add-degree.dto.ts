import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseDegreeEntity} from "../../base/base-degree.entity";

export interface BaseDegreeDto extends BaseDegreeEntity {
  employeeId: number
}

export type AddDegreeDto = BaseAddDto<BaseDegreeDto>
