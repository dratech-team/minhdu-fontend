import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {DegreeEntity} from "../../entities/degree.entity";

export interface BaseUpdateDegreeDto extends Omit<DegreeEntity, 'id'> {
  employeeId: number
}

export type UpdateDegreeDto = BaseUpdateDto<BaseUpdateDegreeDto>
