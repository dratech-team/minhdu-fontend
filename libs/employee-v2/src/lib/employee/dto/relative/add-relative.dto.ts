import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseRelativeEntity} from "../../base/base-relative.entity";

export interface BaseRelativeDto extends BaseRelativeEntity {
  employeeId: number
}

export type AddRelativeDto = BaseAddDto<BaseRelativeDto>
